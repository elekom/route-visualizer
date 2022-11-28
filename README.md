# route-visualizer

https://seeyourroute.web.app/

Created to visualize routes created on <a href="https://www.jorudan.co.jp/norikae/seishun18.html">ジョルダン<a/> 
while traveling around Japan using the <a href="https://www.google.com/search?client=safari&rls=en&q=seishun+18+kippu&ie=UTF-8&oe=UTF-8">青春１８きっぷ<a/>.

Basic design:
1. Parses inputted route link's HTML for stations names.
2. Looks up geocoordinates of stations using Google Places API.
3. Maps out stations using Google Maps JavaScript API.

