// Remove all personal and identification details from the database
// mongo STORAGE_HOST/edx --quiet remove-personal-details.js
db.getCollectionNames().forEach( function( c ) {
  // Clean 'certificates' collections
  if( c.indexOf( 'certificates' ) >= 0 ) {
    db.getCollection(c).update({},{ $unset:
      {
        name: "",
        download_url: ""
      }
    },{ multi:true });
  }

  // Clean 'demographics' collections
  if( c.indexOf( 'demographics' ) >= 0 ) {
    db.getCollection(c).update({},{ $unset:
      {
        name: "",
        meta: "",
        mailing_address: "",
        bio: "",
        profile_image_uploaded_at: ""
      }
    },{ multi:true });
  }

  // Clean 'userIDs' collections
  if( c.indexOf( 'userIDs' ) >= 0 ) {
    db.getCollection(c).update({},{ $unset:
      {
        username: ""
      }
    },{ multi:true });
  }

  // Clean 'users' collections
  if( c.indexOf( 'users' ) >= 0 ) {
    db.getCollection(c).update({},{ $unset:
      {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        email_key: "",
        avatar_type: ""
      }
    },{ multi:true });
  }
});
