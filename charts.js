function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data)
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
   
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(obj=> obj.id == sample);
    console.log(metadataArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = metadataArray[0];
    console.log(metaResult);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
   // 3. Create a variable that holds the washing frequency.
    var wfrequency = parseFloat(metaResult.wfreq);
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topTenIds = ids.slice(0,10);
    console.log(topTenIds);
    var yticks = topTenIds.map(id=> "OTU " + id ).reverse();
    console.log(yticks);

    var topTenValues = values.slice(0,10);
    var sortedValues = topTenValues.reverse();
    console.log(sortedValues);

    var topTenLabels =  labels.slice(0,10);
    var sortedLabels = topTenLabels.reverse();
    console.log(sortedLabels);

   
    // 8. Create the trace for the bar chart. 
    trace = {
      x: sortedValues,
      y:  yticks,
      text:sortedLabels,
      type: "bar",
      orientation: 'h',
      marker: {
        color: 'rgb(236,14,118)'
      }
    };
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      yaxis: { title: "otu_ids"},
      paper_bgcolor: 'rgb(160, 160, 160)'
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

     // 1. Create the trace for the bubble chart.
     var trace =  {
        x: ids,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
            color: ids,
            size: values,
            colorscale:['Blackbody'],
          }
        
      };
  
      var bubbleData = [ trace];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = { title: 'Bacteria Cultures Per Sample',
      xaxis: { title: "OTU ID" },
      hovermode:"x",
      automargin: true,
      paper_bgcolor: 'rgb(160, 160, 160)'
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
      // 4. Create the trace for the gauge chart.
      var trace = {
        value: wfrequency,
        title: { text: "Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            bar: { color: "black" },
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "hotpink" },
            { range: [2, 4], color: "deeppink" },
            { range: [4, 6], color: "mediumvioletred" },
            { range: [6, 8], color: "orchid" },
            { range: [8, 10], color: "magenta" },
         ]
        }
      }
      var gaugeData = [trace];
    
      // 5. Create the layout for the gauge chart.
       var gaugeLayout = { width: 500,
         height: 450,
         margin: { t: 0, b: 0 },
         paper_bgcolor: 'rgb(160, 160, 160)',
      };

      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);  
      
  });
}

