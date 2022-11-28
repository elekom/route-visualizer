const cheerio = require('cheerio');
const got = require('got');
const { queryForLocation } = require('../handlers/geolocationsHandler');

async function getAllStations(lineName) {
  //GET ALL STATIONS IN A LINE
  const lineUrl = `https://map.goo.ne.jp/station/7/${lineName}/`;
  var stations = [];
  await got(lineUrl).then(response => {
    const $ = cheerio.load(response.body);

    const lines = $('ul.btn3.cx');

    lines.each((i, el) => {
      // Station name
      $(el).find('li > a')
        .toArray()
        .map(element => {
          var fullName = $(element).contents().first().text();
          var parsedName;
          var indexOfParen = fullName.indexOf('（');
          if (indexOfParen == -1) {
            parsedName = fullName;
          } else {
            parsedName = fullName.slice(0, indexOfParen);
          }
          stations.push(parsedName + '駅');
        });
    });
  }).catch(err => {
    console.log(err);
  });
  return stations;
}

async function getStationsBetween(from, to, stations) {
  const toIndex = stations.indexOf(to);
  const fromIndex = stations.indexOf(from);

  var stationsBetween = [];

  if ((toIndex != -1) && (fromIndex != -1)) {
    if (toIndex > fromIndex) {
      for (var i = fromIndex + 1; i < toIndex; i++) {
        await queryForLocation(stations[i]).then((data) => {
          stationsBetween.push(data);
        })
      }
    } else {
      for (var i = fromIndex - 1; i > toIndex; i--) {
        await queryForLocation(stations[i]).then((data) => {
          stationsBetween.push(data);
        })
      }
    }
  }
  return stationsBetween;
}

exports.getRouteData = (req, res) => {
  const routeUrl = req.body.routeUrl;

  got(routeUrl).then(async response => {
    const $ = cheerio.load(response.body);

    const routes = $('div.js_routeBlock');

    //GET STATIONS AND LINES FROM ROUTE
    // create map where line is the key, array of all stations in the line is the value
    var allStationsMap = {};
    // Array of all segments in a specific route
    var routeSegments = [];
    // Name of route
    var routeTitle = ($('h1.time').first().contents().filter(function () {
      return this.type === 'text';
    }).text().trim())

    //var resultsPromise = new Promise((resolve, reject) => {
    var routeIndex = req.body.index ? req.body.index : 0;
    var el = routes.toArray()[routeIndex];

    var stations = [];
    var lines = [];
    var waitTimes = [];

    // Station names into array
    $(el).find('td > strong > a')
      .toArray()
      .map(element => {
        var fullName = $(element).contents().first().text();
        var indexOfParen = fullName.indexOf('（');
        indexOfParen == -1 ? stations.push(fullName + '駅') : stations.push(fullName.slice(0, indexOfParen) + '駅');
      });
    // Line names into array
    $(el).find('td > div > a')
      .toArray()
      .map(element => {
        var fullName = $(element).contents().first().text();
        var lineName = fullName.slice(1, fullName.indexOf('線') + 1);
        lines.push(lineName);
      });
    // Wait times into array
    $(el).find('tr.eki > td.tm')
    .toArray()
    .map(element => {
      waitTimes.push($(element).contents().last().text().trim());
    });

    // Get all stations in a line and put into a map?
    // { 中央線: [東京,東中野,...]}
    var lineCount = 0;
    var allSegmentsPopulatedPromise = new Promise((resolve, reject) => {
      lines.forEach(async (line, i, lines) => {
        // Each segment data, push into routeSegments array
        var segmentData = {};

        var fromColName = 'from';
        var toColName = 'to';
        var rosenColName = 'rosen';
        var stationsBetweenColName = 'stationsBetween';
        var segmentNumberColName = 'segmentNumber';
        var waitTime = 'waitTime';

        segmentData[rosenColName] = line;
        segmentData[segmentNumberColName] = i;
        // query for to location geocode in DB
        queryForLocation(stations[i]).then((data) => {
          segmentData[fromColName] = data;
        });
        queryForLocation(stations[i + 1]).then((data) => {
          data[waitTime] = waitTimes[i+1];
          segmentData[toColName] = data;
          // TODO!! Fix stations inbetween option (currently doesn't return anything if false)
          if (!req.body.includeStationsBetween) {
            routeSegments.push(segmentData);
            lineCount++;
            if (lineCount === lines.length) resolve();
          }
        });

        // GET ALL STATIONS INBETWEEN TO AND FROM
        if (req.body.includeStationsBetween) {
          if (!allStationsMap.hasOwnProperty(line)) {
            const allLines = await getAllStations(line);
            allStationsMap[line] = allLines;
          }
          getStationsBetween(stations[i], stations[i + 1], allStationsMap[line]).then((stationsBetween) => {
            segmentData[stationsBetweenColName] = stationsBetween;
            routeSegments.push(segmentData);
            lineCount++;
            if (lineCount === lines.length) resolve();
          });
        }

      })
    }).catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });

    allSegmentsPopulatedPromise.then(() => {
      return res.status(201).json({
        routeTitle: routeTitle,
        routeSegments: routeSegments,
        routeUrl: routeUrl
      });
    });

  });

  // }).catch(err => {
  //   console.log(err);
  //   return res
  //     .status(500)
  //     .json({ general: "Something went wrong, please try again" });
  // });
}
