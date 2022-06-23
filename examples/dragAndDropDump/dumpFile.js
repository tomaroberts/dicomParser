// This function will read the file into memory and then start dumping it
function dumpFile(file)
{
    // clear any data currently being displayed as we parse this next file
    document.getElementById('dropZone').innerHTML = '';
    $('#status').removeClass('alert-warning alert-success alert-danger').addClass('alert-info');
    $('#warnings').empty();
    document.getElementById('statusText').innerHTML = 'Status: Loading file, please wait..';

    var reader = new FileReader();
    reader.onload = function(file) {
        var arrayBuffer = reader.result;

        // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
        // Uint8Array so we create that here
        var byteArray = new Uint8Array(arrayBuffer);

        var kb = byteArray.length / 1024;
        var mb = kb / 1024;
        var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB";
        document.getElementById('statusText').innerHTML = 'Status: Parsing ' + byteStr + ' bytes, please wait..';

        // set a short timeout to do the parse so the DOM has time to update itself with the above message
        setTimeout(function() {

            // Invoke the paresDicom function and get back a DataSet object with the contents
            var dataSet;
            try {
                var start = new Date().getTime();
                dataSet = dicomParser.parseDicom(byteArray);
                // Here we call dumpDataSet to recursively iterate through the DataSet and create an array
                // of strings of the contents.
                var output = [];
                rewriteDataSet(dataSet, output);
                // dumpDataSet(dataSet, output);

                // Combine the array of strings into one string and add it to the DOM
                document.getElementById('dropZone').innerHTML = '<ul>' + output.join('') + '</ul>';

                var end = new Date().getTime();
                var time = end - start;
                if(dataSet.warnings.length > 0)
                {
                    $('#status').removeClass('alert-success alert-info alert-danger').addClass('alert-warning');
                    $('#statusText').html('Status: Warnings encountered while parsing file (file of size '+ byteStr + ' parsed in ' + time + 'ms)');

                    dataSet.warnings.forEach(function(warning) {
                        $("#warnings").append('<li>' + warning +'</li>');
                    });
                }
                else
                {
                    var pixelData = dataSet.elements.x7fe00010;
                    if(pixelData) {
                        $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                        $('#statusText').html('Status: Ready (file of size '+ byteStr + ' parsed in ' + time + 'ms)');
                    }
                    else
                    {
                        $('#status').removeClass('alert-warning alert-info alert-danger').addClass('alert-success');
                        $('#statusText').html('Status: Ready - no pixel data found (file of size ' + byteStr + ' parsed in ' + time + 'ms)');
                    }
                }

                // TAR – click to download the de-identified DICOM
                $('#download').click(function() {
                    console.log(dataSet);

                    var blob = new Blob([dataSet.byteArray], {type: "application/dicom"});
                    var url = window.URL.createObjectURL(blob);
                    window.open(url);
                    window.URL.revokeObjectURL(url);
                })

            }
            catch(err)
            {
                var message = err;
                if(err.exception) {
                    message = err.exception;
                }

                $('#status').removeClass('alert-success alert-info alert-warning').addClass('alert-danger');
                document.getElementById('statusText').innerHTML = 'Status: Error - ' + message + ' (file of size ' + byteStr + ' )';
                if(err.output) {
                    document.getElementById('dropZone').innerHTML = '<ul>' + output.join('') + '</ul>';
                }
                else if(err.dataSet) {
                    var output = [];
                    dumpDataSet(err.dataSet, output);
                    document.getElementById('dropZone').innerHTML = '<ul>' + output.join('') + '</ul>';
                }
            }
        },10);
    };

    reader.readAsArrayBuffer(file);
}