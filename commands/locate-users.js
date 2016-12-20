// Helper method to try and locate users without a country set
// IPs database used: http://dev.maxmind.com/geoip/legacy/geolite/
//
// 1.- Determine users without country set in the demographics collection
// db.idb8_1x_2015_t4.demographics.find({country:""},{user_id:1})
//
// 2.- Use 'user_id' to try and get the IP from a user event
// db.events.findOne({"context.user_id": ? },{ip:1,_id:0})
//
// 3.- Use the IP ( first 3 segments ) to locate user's the country code
// ip.split(".").slice(0,3).join(".")+".0"
// db.ips.findOne({ip:"199.79.165.0"},{"location.country_code":1,_id:0})
//
// 4.- Update the 'demographics' record for the user adding the field 'country'
//
// mongo STORAGE_HOST/edx --quiet locate-users.js

// State
var net;
var e;
var c;
var res = {
  total:   0,
  active:  0,
  located: 0
};

// Populate courses list
var list = [];
db.getCollectionNames().forEach( function( v ) {
  if( v.indexOf( 'idb' ) == 0 ) {
    var entry = v.split( '.' );
    if( list.indexOf( entry[0] ) == -1 ) {
      list.push( entry[0] );
    }
  }
});

// Iterate list
list.forEach( function( id ) {
  // Locate users without contry record
  var users = db[ id ].demographics.find({country:""},{user_id:1});
  users.forEach( function( el ) {
    res.total += 1;

    // Try and locate the first event for the user
    e = db.events.findOne({"context.user_id": el.user_id },{ip:1,_id:0});
    if( e && e.ip !== "" ) {
      res.active += 1;

      // Obtain network address for IP and try to locate the country
      net = e.ip.split(".").slice(0,3).join(".")+".0";
      c = db.ips.findOne({ip: net},{"location.country_code":1,_id:0});
      if( c ) {
        db[ id ].demographics.update({_id:el._id},{country:c.location.country_code});
        res.located += 1;
      }
    }
  });
  print( id );
});

// Print stats
printjson( res );
