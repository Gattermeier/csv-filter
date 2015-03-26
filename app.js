/**
 * Created by M. Gattermeier on 3/24/15.
 *
 **/

var fs = require('fs');
var csv = require('ya-csv');
var converter = require('json-2-csv');
var ProgressBar = require('progress');

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


if (!sourcefile || !filterfile) {
    console.log('Usage: node app.js [-i sourcefile.csv] [-f filterfile.csv] [-o outputfile.csv] [--filter: FIELD]')
    console.log('Default output file: output.csv | Default filter value: Email')
} else {

    filterRecords();
}




function filterRecords(){
    console.log('Please wait.. Depending on file size, this can take a while.');

    var recordsArr = [];
    var filterArr = [];
    var results = [];
    var readCount = 0;

    var recordsReader = csv.createCsvFileReader(sourcefile, { columnsFromHeader: true });
    var filterReader = csv.createCsvFileReader(filterfile, { columnsFromHeader: true });


    recordsReader.addListener('data', function(data) {
        if (data[filter]) {
            recordsArr.push(data);
        }
    });

    filterReader.addListener('data', function(data) {
        if (data[filter]) {
            filterArr.push(data);
        }
    });

    recordsReader.on('end', function(){
        readCount++;
        readerEnd(readCount);
    });

    filterReader.on('end',function(){
        readCount++;
        readerEnd(readCount);
    })

    function readerEnd(readCount) {
        var bar = new ProgressBar('Processing [:bar] :percent ETAS: :etas', {
            total: filterArr.length,
            complete: '=',
            incomplete: ' '
        });

        if (readCount >=2) {

                for (i = 0; i < filterArr.length; i++) {
                    var find = filterArr[i][filter];
                    for (j = 0; j < recordsArr.length; j++) {
                        if (find === recordsArr[j][filter]) {
                            results.push(recordsArr[j]);
                            //console.log('Matching Record. Filter position '+i+' of ' + filterArr.length +' and Records position '+j+' of '+ recordsArr.length);
                            recordsArr.splice(j, 1);
                        }
                    }
                    bar.tick();
                }
            console.log('loop end');

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
        }
    }


}



