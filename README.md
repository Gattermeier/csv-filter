# csv-filter
A small node app for the command line. It takes a source CSV file, a filter CSV file and outputs matching records after applying a colum as chosen filter.   

**Install**   
_npm install_

**Usage:**    
_node app.js [-i sourcefile.csv] [-f filterfile.csv] [-o outputfile.csv] [--filter: FIELD]_   

**Default Options:**
* Output file: output.csv
* Filter: 'Email'
