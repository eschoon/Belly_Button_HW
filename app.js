//Belly Button Biodiversity Javascript file

//Create a function that builts Metadata sample:
function buildMetadata(sample) { 
d3.json(`/metadata/${sample}`).then(function(sampleData) {
  
  //Console log sample data to confirm that data has been loaded correctly:
  console.log(sampleData);

  // Use `d3.json` to fetch the metadata for a sample

    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(sampleData).forEach(([key,value]) => {
      panel.append('h6').text(`${key},${value}`)
    });
  });
};

//Create a function that builts charts:
function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(function(sampleData) {
    console.log(sampleData)

    const otu_ids = sampleData.otu_ids
    const otu_labels = sampleData.otu_labels
    const sample_values = sampleData.sample_values


  
    // Create a bubble chart
    var bubbleChart = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Rainbow"
      }
    }];

    var bubbleLayout = {
      margin: {t: 0},
      xaxis: {title: 'OTU_ID'}
    };
  Plotly.plot('bubble', bubbleChart, bubbleLayout);


  //Build a Pie Chart
   
  var pieData = [{
    values: sample_values.slice(0,10),
    labels: otu_ids.slice(0,10),
    hovertext: otu_labels.slice(0,10),
    hoverinfo: 'hovertext',
    type: 'pie'
  }];

  var pieLayout = {
    margin: {t: 0, l: 0}
  };
Plotly.plot('pie', pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
