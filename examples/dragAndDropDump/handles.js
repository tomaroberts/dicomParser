// helper function to see if a string only has ascii characters in it
function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

// this function gets called once the user drops the file onto the div
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // Get the FileList object that contains the list of files that were dropped
    var files = evt.dataTransfer.files;

    // this UI is only built for a single file so just dump the first one
    dumpFile(files[0]);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);