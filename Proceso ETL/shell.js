// Helper file that incorporate a generateCourseReport function
// for the Mongo Shell
//
// Load the helper for interactive use in the shell:
// mongo STORAGE_HOST/edx --shell shell.js
//
// Generate a report directly from CLI:
// mongo STORAGE_HOST/edx --quiet --eval "var report='idb...'" shell.js > course-report.json

// If no report is set, initialize the variable to a 'falsy' state
if( typeof report == undefined ) {
  var report = false;
}

// If a report id is set, execute right away
if( typeof report !== undefined && report ) {
  printjson( generateCourseReport( report ) );
}

// Metadata of all available courses
var coursesMetadata = [
  {
    "id": "idb10x_2015_t4",
    "name": "Datología: La toma de decisiones basadas en datos (1ed.)",
    "sme": "SCL, SPD, INE, HRD",
    "start_date": "11/10/2015",
    "end_date": "12/25/2015"
  },
  {
    "id": "idb10x_3t2016",
    "name": "Datología: La toma de decisiones basadas en datos (2ed.)",
    "sme": "SCL, SPD, INE, HRD",
    "start_date": "10/18/2015",
    "end_date": "12/6/2015"
  },
  {
    "id": "idb12x_2016_t2",
    "name": "Políticas efectivas de desarrollo infantil temprano (1ed.)",
    "sme": "SCL/SPH",
    "start_date": "7/19/2016",
    "end_date": "8/30/2016"
  },
  {
    "id": "idb1x_2015_3t",
    "name": "Introducción a la Gestion para Resultados en el Desarrollo (2ed.)",
    "sme": "IFD/ICS",
    "start_date": "5/19/2015",
    "end_date": "7/1/2015"
  },
  {
    "id": "idb1x_2016_t2",
    "name": "Introducción a la Gestión para Resultados en el Desarrollo (3ed.)",
    "sme": "IFD/ICS",
    "start_date": "6/7/2016",
    "end_date": "7/19/2016"
  },
  {
    "id": "idb1x_2t2014",
    "name": "Introducción a la Gestión para Resultados en el Desarrollo (1ed.)",
    "sme": "IFD/ICS",
    "start_date": "9/30/2014",
    "end_date": "11/11/2014"
  },
  {
    "id": "idb2x_3t2014",
    "name": "Mejores Pensiones, Mejores Trabajos (1ed.)",
    "sme": "SCL/LMK",
    "start_date": "3/10/2016",
    "end_date": "5/21/2016"
  },
  {
    "id": "idb3x_2015_t3",
    "name": "Agua en América Latina: Abundancia en medio de la escasez mundial (1ed.)",
    "sme": "INE/WSA",
    "start_date": "9/29/2015",
    "end_date": "12/2/2015"
  },
  {
    "id": "idb3x_2016_t2",
    "name": "Agua en América Latina: Abundancia en medio de la escasez mundial (2ed.)",
    "sme": "INE/WSA",
    "start_date": "5/3/2016",
    "end_date": "07/12/2016"
  },
  {
    "id": "idb4_1x_2015_t4",
    "name": "Liderando o Desenvolvimento Sustentável das Cidades (1ed.)",
    "sme": "IFD, INE, CSD/HUD",
    "start_date": "11/3/2015",
    "end_date": "12/21/2015"
  },
  {
    "id": "idb4_1x_2016_t1",
    "name": "Liderando o Desenvolvimento Sustentável das Cidades (2ed.)",
    "sme": "IFD, INE, CSD/HUD",
    "start_date": "9/27/2016",
    "end_date": "11/7/2016"
  },
  {
    "id": "idb4x_2016_t1",
    "name": "Liderando el Desarrollo Sostenible de las Ciudades (3ed.)",
    "sme": "IFD, INE, CSD/HUD",
    "start_date": "9/27/2016",
    "end_date": "11/7/2016"
  },
  {
    "id": "idb5x_2016_t3",
    "name": "Nuevas Tendencias en Tratados Comerciales en América Latina (1ed.)",
    "sme": "INT/INT",
    "start_date": "4/19/2016",
    "end_date": "6/1/2016"
  },
  {
    "id": "idb5_1x_3t2016",
    "name": "New Trends in Trade Agreements in Latin America & the Caribbean (1ed.)",
    "sme": "INT/INT",
    "start_date": "10/25/2016",
    "end_date": "2/5/2016"
  },
  {
    "id": "idb6_1x_2016_t2",
    "name": "Project Management Techniques for Development Professionals",
    "sme": "KNL/SDI",
    "start_date": "4/26/2016",
    "end_date": "5/31/2016"
  },
  {
    "id": "idb6_3x_3t2016",
    "name": "Gestion de projets de développement",
    "sme": "KNL/SDI",
    "start_date": "9/6/2016",
    "end_date": "10/11/2016"
  },
  {
    "id": "idb6x_2015_t2",
    "name": "Gestión de Proyectos de Desarrollo (1ed.)",
    "sme": "KNL/SDI",
    "start_date": "7/28/2015",
    "end_date": "9/2/2015"
  },
  {
    "id": "idb6x_2016_t1",
    "name": "Gestión de Proyectos de Desarrollo (2ed.)",
    "sme": "KNL/SDI",
    "start_date": "3/29/2016",
    "end_date": "5/4/2016"
  },
  {
    "id": "idb6x_3t2016",
    "name": "Gestión de Proyectos de Desarrollo (3ed.)",
    "sme": "KNL/SDI",
    "start_date": "10/11/2016",
    "end_date": "11/15/2016"
  },
  {
    "id": "idb7x_2015_t1",
    "name": "Desarrollo Urbano y Vivienda (1ed.)",
    "sme": "CSD/HUD",
    "start_date": "7/14/2015",
    "end_date": "8/26/2015"
  },
  {
    "id": "idb7x_2t2016",
    "name": "Desarrollo Urbano y Vivienda (2ed.)",
    "sme": "CSD/HUD",
    "start_date": "7/21/2016",
    "end_date": "8/03/2016"
  },
  {
    "id": "idb8_1x_2015_t4",
    "name": "Aliancas Público Privadas para o Desenvolvimento: Implementando Solucoes no Brasil",
    "sme": "INE, FOMIN, IFD/FMM,SCL/SPH",
    "start_date": "11/17/2015",
    "end_date": "12/22/2015"
  },
  {
    "id": "idb8x_2015_t3",
    "name": "Asociaciones Publico Privadas: Implementando Soluciones en Latinoamérica y el Caribe (1ed.)",
    "sme": "INE, FOMIN, IFD/FMM,SCL/SPH",
    "start_date": "6/30/2015",
    "end_date": "8/11/2015"
  },
  {
    "id": "idb8x_2015_t4",
    "name": "Asociaciones Publico Privadas: Implementando Soluciones en Latinoamérica y el Caribe (2ed.)",
    "sme": "INE, FOMIN, IFD/FMM,SCL/SPH",
    "start_date": "10/27/2015",
    "end_date": "11/30/2015"
  },
  {
    "id": "idb8x_2t2016",
    "name": "Asociaciones Publico Privadas: Implementando Soluciones en Latinoamérica y el Caribe (3ed.)",
    "sme": "INE, FOMIN, IFD/FMM,SCL/SPH",
    "start_date": "6/14/2016",
    "end_date": "7/19/2016"
  },
  {
    "id": "idb9x_2015_t2",
    "name": "Realidad Macroeconómica Latinoamericana (1ed.)",
    "sme": "RES",
    "start_date": "6/23/2015",
    "end_date": "8/4/2015"
  },
  {
    "id": "idb9x_2t2016",
    "name": "Realidad Macroeconómica Latinoamericana (2ed.)",
    "sme": "RES",
    "start_date": "10/11/2016",
    "end_date": "11/29/2016"
  },
  {
    "id": "idb_lsc101x_2015_t4",
    "name": "Liderando el Desarrollo Sostenible de las Ciudades (2ed.)",
    "sme": "IFD, INE, CSD/HUD",
    "start_date": "11/3/2015",
    "end_date": "12/21/2015"
  },
  {
    "id": "idb_lsc101x_3t2014",
    "name": "Liderando el Desarrollo Sostenible de las Ciudades (1ed.)",
    "sme": "IFD, INE, CSD/HUD",
    "start_date": "3/17/2015",
    "end_date": "4/28/2015"
  },
  {
    "id": "idb13x_2t2016",
    "name": "Agrimonitor: política agropecuaria, seguridad alimentaria y cambio climático (1ed.)",
    "sme": "CSD/RND",
    "start_date": "6/21/2016",
    "end_date": "7/26/2016"
  },
  {
    "id": "idb13_1x_3t2016",
    "name": "Agrimonitor: Agricultural Policy, Food Security and Climate Change (1ed.)",
    "sme": "CSD/RND",
    "start_date": "10/25/2016",
    "end_date": "11/29/2016"
  },
  {
    "id": "idb2x_2_2t2016",
    "name": "Pensiones en América Latina y el Caribe (2ed.)",
    "sme": "SCL/LMK",
    "start_date": "7/12/2016",
    "end_date": "8/23/2016"
  }
];


// Helper method to generate a summary of the course state
function generateCourseReport( id ) {
  var cache = {};

  // Utility method to remove 'falsy' entries from a structure
  var _clean = function( entry ) {
    for( var k in entry ) {
      if( entry.hasOwnProperty( k ) ) {
        if( ! entry[ k ] ) {
          delete entry[ k ];
        }
      }
    }
    return entry;
  };

  // Utility method that group users by specfic demographics
  var _groupByDemographics = function( metric, filters ) {
    // Result holder
    var result = {};
    var stack;

    // Get metric stack
    if( ! cache[ id + '_' + metric ] ) {
      stack = db[ id ].demographics.distinct( metric );
      if( stack.indexOf( "" ) > -1 ) {
        stack.splice( stack.indexOf( "" ), 1 );
      }
      if( stack.indexOf( "NULL" ) > -1 ) {
        stack.splice( stack.indexOf( "NULL" ), 1 );
      }

      // Store metric stack in local cache for future iterations
      cache[ id + '_' + metric ] = stack;
    } else {
      // Load stack from cache to speed up things
      stack = cache[ id + '_' + metric ];
    }

    stack.forEach( function( el ) {
      var query = {};
      query[ metric ] = el;

      // Attach additional filters if any
      if( filters ) {
        for( var k in filters ) {
          if( filters.hasOwnProperty( k ) ) {
            query[ k ] = filters[ k ];
          }
        }
      }
      result[ el ] = db[ id ].demographics.find( query ).count();
    });

    return _clean( result );
  }

  // General course structure
  var course = {
    code: id,
    users: {
      total: db[ id ].enrollments.count(),
      active: db[ id ].courseware.distinct( 'student_id' ).length,
      certificates: {
        failed: ( db[ id ].certificates.find({"status":"notpassing"},{}).count() || 0 ),
        approved: ( db[ id ].certificates.find().count({"grade":{$gt:0.65}}) || 0 ),
        certified: ( db[ id ].certificates.find({"status":"downloadable"},{}).count() || 0 )
      }
    },
    gender: _groupByDemographics( 'gender' ),
    education: _groupByDemographics( 'level_of_education' ),
    countries: _groupByDemographics( 'country' )
  };

  // Expand details by country
  for( var k in course.countries ) {
    if( course.countries.hasOwnProperty( k ) ) {
      course.countries[ k ] = {
        total: course.countries[ k ],
        gender: _groupByDemographics( 'gender', { country: k } ),
        education: _groupByDemographics( 'level_of_education', { country: k } ),
        birth: _groupByDemographics( 'year_of_birth', { country: k } )
      }
    }
  }

  // Attach report creation date
  course.created = new Date();

  return course;
}
