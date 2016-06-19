(function () {
    var myConnector = tableau.makeConnector();
 
    myConnector.getSchema = function (schemaCallback) {
    var cols = [
        { id : "daet_time", alias : "Date_Time", dataType : tableau.dataTypeEnum.datetime },
        { id : "qv_market_peel_st", alias : "Hourly_Counts", dataType : tableau.dataTypeEnum.int },
        { id : "sensor_id", alias : "Sensor_ID", dataType : tableau.dataTypeEnum.int },
        { id : "sensor_name", alias : "Sensor_Name", dataType : tableau.dataTypeEnum.string }

    ];

    var tableInfo = {
        id : "pedestrianCounts",
        alias : "Hourly Pedestrian Counts across Melbourne City in 2016",
        columns : cols
    };

    schemaCallback([tableInfo]);
};
 
    myConnector.getData = function (table, doneCallback) {
    var tableData = [],
        daet_time = "",
        qv_market_peel_st = 0,
        sensor_id = 0,
        sensor_name = "";

    // City of Melbourne dataset explorer https://data.melbourne.vic.gov.au/Transport-Movement/Pedestrian-Counts/b2ak-trbp#column-menu
    // The daet_time field is a string and I haven't figured out how to filter by a time period yet! 
    // For now I'm just using a substring match via the API SOQL like function to match only 2016 entries
    // todo - find out the lat longs of the sensors and add it to the table

    $.getJSON("https://data.melbourne.vic.gov.au/resource/mxb8-wn4w.json?$where=daet_time like '%25-2016%25'", function (resp) {
        
       // iterate over the JSON array
        for (var i = 0; i<resp.length; i++) {
            var obj = resp[i];

            tableData.push({
                "daet_time" : obj.daet_time,
                "qv_market_peel_st" : obj.qv_market_peel_st,
                "sensor_id" : obj.sensor_id,
                "sensor_name" : obj.sensor_name
        });
        };

        table.appendRows(tableData);

        doneCallback();
    });
};
 
    tableau.registerConnector(myConnector);
    
    $(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "Melbourne City Pedestrian Counts";
        tableau.submit();
    });
});

})();