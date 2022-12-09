# route-visualizer-api

API for Route Visualizer

## Endpoints
### Routes
- To visualize a route, send POST request to endpoint
    ``` js
    '/routes'
    ```
    <details>
    <summary>Request Object</summary>

    ``` json
    {
        "routeUrl" : "https://www.jorudan.co.jp/norikae/cgi/nori.cgi?eki1=%E9%AB%98%E5%86%86%E5%AF%BA&eki2=%E9%87%91%E6%B2%A2&eki3=&via_on=1&Dyy=2022&Dmm=8&Ddd=2&Dhh=14&Dmn1=5&Dmn2=2&Cway=2&Cfp=1&Czu=2&C7=1&C2=0&C3=0&C1=0&sort=rec&C4=5&C5=0&C6=2&S=%E6%A4%9C%E7%B4%A2&Cmap1=&rf=nr&pg=1&eok1=R-&eok2=R-&eok3=&Csg=1", // string JORUDAN url
        "index" : 0, // integer
        "includeStationsBetween" : false // boolean 
    }
    ```

    </details>

    <details>
    <summary>Response Object</summary>

    ``` json
    {
        "routeTitle":"仙台 から 青森",
        "routeSegments":[
            {
                "rosen":"山形線",
                "segmentNumber":1,
                "to":
                    {
                        "locationName":"新庄駅",
                        "waitTime":"待ち56分"
                    },
                "from":
                    {
                        "locationName":"羽前千歳駅"
                    }
            },
            {
                "rosen":"仙山線",
                "segmentNumber":0,
                "to":
                    {
                        "locationName":"羽前千歳駅",
                        "waitTime":"待ち68分"
                    },
                "from":
                    {
                        "locationName":"仙台駅",
                        "geocode":
                            {
                                "lat":38.2601316,
                                "lng":140.8824375
                            },
                        "place_id":"ChIJhwtRDBgoil8RvP0fvpELo7I"
                    }
            },
            {
                "rosen":"奥羽本線",
                "segmentNumber":3,
                "to":
                    {
                        "locationName":"青森駅",
                        "waitTime":""
                    },
                "from":
                    {
                        "locationName":"秋田駅"
                    }
            },
            {
                "rosen":"奥羽本線",
                "segmentNumber":2,
                "from":
                    {
                        "locationName":"新庄駅"
                    },
                "to":
                    {
                        "locationName":"秋田駅",
                        "waitTime":"待ち70分"
                    }
            }
        ],
        "routeUrl":"https://www.jorudan.co.jp/norikae/cgi/nori.cgi?eki1=仙台&eki2=青森&via_on=-1&eki3=&eki4=&eki5=&eki6=&Dyy=2022&Dmm=12&Ddd=9&Dhh=10&Dmn1=2&Dmn2=7&Cway=0&Cfp=1&Czu=2&C7=1&C2=0&C3=0&C1=0&sort=rec&C4=5&C5=0&C6=2&S=検索&Cmap1=&rf=nr&pg=1&eok1=R-&eok2=R-&eok3=&eok4=&eok5=&eok6=&Csg=1"
    }
    ```

    </details>

- To save a route for a user, send POST request to  endpoint
    ``` js
    '/routes/add'
    ```
    With user's token in header
    <details>
    <summary> Request Object </summary>

    ``` json
    {
        "routeTitle":"仙台 から 青森",
        "routeSegments":[
            {
                "rosen":"山形線",
                "segmentNumber":1,
                "to":
                    {
                        "locationName":"新庄駅",
                        "waitTime":"待ち56分"
                    },
                "from":
                    {
                        "locationName":"羽前千歳駅"
                    }
            },
            {
                "rosen":"仙山線",
                "segmentNumber":0,
                "to":
                    {
                        "locationName":"羽前千歳駅",
                        "waitTime":"待ち68分"
                    },
                "from":
                    {
                        "locationName":"仙台駅",
                        "geocode":
                            {
                                "lat":38.2601316,
                                "lng":140.8824375
                            },
                        "place_id":"ChIJhwtRDBgoil8RvP0fvpELo7I"                  
                    }
            },
            {
                "rosen":"奥羽本線",
                "segmentNumber":3,
                "to":
                    {
                        "locationName":"青森駅",
                        "waitTime":""
                    },
                "from":
                    {
                        "locationName":"秋田駅"
                    }
            },
            {
                "rosen":"奥羽本線",
                "segmentNumber":2,
                "from":
                    {
                        "locationName":"新庄駅"
                    },
                "to":
                    {
                        "locationName":"秋田駅",
                        "waitTime":"待ち70分"
                    }
            }
        ],
        "routeUrl":"https://www.jorudan.co.jp/norikae/cgi/nori.cgi?eki1=仙台&eki2=青森&via_on=-1&eki3=&eki4=&eki5=&eki6=&Dyy=2022&Dmm=12&Ddd=9&Dhh=10&Dmn1=2&Dmn2=7&Cway=0&Cfp=1&Czu=2&C7=1&C2=0&C3=0&C1=0&sort=rec&C4=5&C5=0&C6=2&S=検索&Cmap1=&rf=nr&pg=1&eok1=R-&eok2=R-&eok3=&eok4=&eok5=&eok6=&Csg=1"
    }
    ```

    </details>

- To retreive saved routes for a user, send GET request to end point
    ``` js
    '/routes/saved'
    ```
    With user's token in header
    <details>
    <summary>Response Object</summary>

    ``` json
    [
        {
            "id" : "", // string saved name of route
            "routeSegments" : [], // array
            "routeUrl" : "" // string JORUDAN url
        }
    ]
    ```
    </details>

### Geolocations
- To save geocoordinates of locations, send POST request to end point
    ``` js
    'geolocations/add'
    ```
    <details>
    <summary>Request Object</summary>

    ``` json
    {
        "locations":[
            {
                "locationName":"横須賀駅",
                "geocode":
                    {
                        "lat":35.284198,
                        "lng":139.654875
                    },
                "place_id":"ChIJpcu4ZWNAGGAR5pgsszk1nfQ"
            },
            {
                "locationName":"東逗子駅",
                "geocode":
                    {
                        "lat":35.29875,
                        "lng":139.6019062
                    },
                "place_id":"ChIJS4cIxc9GGGARDcOh_feT8GU"
            },
        ]
    }
    ```
    </details>