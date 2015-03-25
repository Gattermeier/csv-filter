/**
 * Created by M. Gattermeier on 3/24/15.
 *
 **/

var fs = require('fs');
var csv = require('ya-csv');
var converter = require('json-2-csv');

var argv = require('minimist')(process.argv.slice(2));

var sourcefile = argv.i;
var filterfile = argv.f;

if (argv.o) {
    var outputfile = argv.o;
} else {
    var outputfile = 'output.csv';
}
if (argv.filter) {
    var filter = argv.filter;
} else {
    var filter = 'Email';
}

// if stop true we won't filter but abort
var stop = false;


if (!sourcefile || !filterfile) {
    console.log('Usage: node app.js [-i sourcefile.csv] [-f filterfile.csv] [-o outputfile.csv] [--filter: FIELD]')
    console.log('Default output file: output.csv | Default filter value: Email')
} else {
    filterRecords();
}

function filterRecords(){

    var records = [];
    var filterArr = [];
    var results = [];

    var recordsReader = csv.createCsvFileReader(sourcefile, { columnsFromHeader: true });
    var filterReader = csv.createCsvFileReader(filterfile, { columnsFromHeader: true });


    recordsReader.addListener('data', function(data) {
        records.push(data);
    });

    filterReader.addListener('data', function(data) {
        if (!data[filter]) {
            stop = true;
            return false;
        } else {
            filterArr.push(data);
        }
    });

    recordsReader.on('end', function(){

        filterReader.on('end',function(){

            if (!stop) {

                for (i = 0; i < filterArr.length; i++) {
                    var find = filterArr[i][filter];
                    for (j = 0; j < records.length; j++) {
                        if (find === records[j][filter]) {

                            results.push(records[j]);

                        }
                    }
                }

                var json2csvCallback = function (err, csv) {
                    if (err) {
                        console.log(err);
                    }

                    fs.writeFile(outputfile, csv, function (err) {
                        if (err) {
                            console.log(err);
                        }

                        console.log('Saved: '+ outputfile);
                    });

                };

                converter.json2csv(results, json2csvCallback);

            } else {
                console.log('Error, filter value '+filter+' not found in (some) entries of '+filterfile);
            }

        })


    });

}

