function dumpDataSet(dataSet)
{
    $('span[data-dicom]').each(function(index, value)
    {
        var attr = $(value).attr('data-dicom');
        var element = dataSet.elements[attr];
        var text = "";
        if(element !== undefined)
        {
            var str = dataSet.string(attr);
            if(str !== undefined) {
                text = str;
            }
        }
        $(value).text(text);
    });

    $('span[data-dicomUint]').each(function(index, value)
    {
        var attr = $(value).attr('data-dicomUint');
        var element = dataSet.elements[attr];
        var text = "";
        if(element !== undefined)
        {
            if(element.length === 2)
            {
                text += dataSet.uint16(attr);
            }
            else if(element.length === 4)
            {
                text += dataSet.uint32(attr);
            }
        }

        $(value).text(text);
    });

}