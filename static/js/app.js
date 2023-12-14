
// Creation of a dashboard displaying information for an individual selected in a dropdown menu. 
// The underlaying data is a JSON file accessible by its URL.

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Tentative to create the lines with ids in the HTML code
// let listMeta = d3.select(".panel-body");
// listMeta.insertAdjacentElement('afterend', "<p> id='id' </p>");
// listMeta.append("p").text(`id='ethnicity'>`);
// listMeta.append("p").text(`id='gender'>`);
// listMeta.append("p").text(`id='age'>`);
// listMeta.append("p").text(`id='location'>`);
// listMeta.append("p").text(`id='bbtype'>`);
// listMeta.append("p").text(`id='wfreq'>`);

// var elements = document.getElementsByClassName("panel-body");
// // elements.insertAdjacentElement('afterend', "<p id="id" style="padding-left: 10px;"></p>");
// var elem = document.createElement("p");
// elem.id = 'id';
// elem.innerHTML = 'Id';
// document.body.insertBefore(elem,document.body.childNodes[0]);
// console.log(elements);

// Creation of the Promise
var dataCollected = d3.json(url);



// *****   Identifies the selection in the dropdown menu   *****

function optionChanged(selectedClick) {             // This function is called in the html file line #25
    manageplot(selectedClick);
    // return selectedClick                         // The return value is not used
};


// *****   Creates the dashboard based on the selection in the dropdown menu   *****
function manageplot(selectedClick = 0) {
    dataCollected.then(dataSet => {
        var nameIdList = dataSet.names;
        var metadataList = dataSet.metadata;
        var sampleList = dataSet.samples;


        // *****   Creation of the Dropdown menu   *****

        // Need to test if the dropdown does not already exist or it will append the full list at each selection 
        let selector = d3.select("#selDataset");
        Object.values(nameIdList).map(item => item).forEach(d => {
            selector.append("option").attr("value", nameIdList.indexOf(d)).text(d);  // Based on how the json data is structured (a object containing three arrays),
        });                                                                          // the only thing linking the values across the arrays is their position in each array.
                                                                                     // We will then use the index position (indexValue) as way to select the matched
                                                                                     // data from the three arrays.

        // *****   Populates the demographic info box based on the menu selection   *****
        function demographics(indexValue) { 
            let listMeta = d3.select(".panel-body");

            d3.select("#id").text(`id: ${metadataList[indexValue].id}`);            // use the unique id= to identify the row of html code to be updated.
            d3.select("#ethnicity").text(`ethnicity: ${metadataList[indexValue].ethnicity}`);
            d3.select("#gender").text(`gender: ${metadataList[indexValue].gender}`);
            d3.select("#age").text(`age: ${metadataList[indexValue].age}`);
            d3.select("#location").text(`location: ${metadataList[indexValue].location}`);
            d3.select("#bbtype").text(`bbtype: ${metadataList[indexValue].bbtype}`);
            d3.select("#wfreq").text(`wfreq: ${metadataList[indexValue].wfreq}`);
            };


        // *****   Creation of the all the plots from a single function   *****

        function createPlot(indexValue) {

        // Creation of a horizontal bar chart to display the top 10 OTUs found in that individual.
            // Collection of all the sample data fo the selected individual.
            var newList = [];
            for (var j = 0; j < sampleList[indexValue].sample_values.length; j++)
                newList.push({ 'otu_ids': sampleList[indexValue].otu_ids[j], 'sample_values': sampleList[indexValue].sample_values[j], 'otu_labels': sampleList[indexValue].otu_labels[j] });

            // Identification of top 10.
            let listTop10 = newList.sort((a, b) => b.sample_values - a.sample_values).slice(0, 10).reverse();


            // bar graph creation.
            trace1 = [{
                y: listTop10.map(object => `OTU ${object.otu_ids}`),
                x: listTop10.map(object => object.sample_values),
                text: listTop10.map(object => object.otu_labels),
                type: "bar",
                orientation: 'h'
            }];

            let layout = {
                title: `Top Ten Bacteria for Subject ID No:${sampleList[indexValue].id}`,
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 100,
                    pad: 10
                }
            };

            Plotly.newPlot("bar", trace1, layout);


            //bubble plot creation

            trace2 = [{

                x: newList.map(object => object.otu_ids),
                y: newList.map(object => object.sample_values),
                text: newList.map(object => object.otu_labels),
                mode: 'markers',
                marker: {
                    size: newList.map(object => object.sample_values),
                    color: newList.map(object => object.otu_ids)
                }
            }];

            let layout2 = {
                title: `Bacterial distribution for Subject ID No: ${sampleList[indexValue].id}`,       // to be removed
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 100,
                    pad: 10
                },
                xaxis: {
                    title: {
                        text: ' Operational Taxonomic Unit (OTU) ID',
                        //   font: {
                        //     family: 'Courier New, monospace',
                        //     size: 18,
                        //     color: '#7f7f7f'
                    }
                }
            };

            Plotly.newPlot("bubble", trace2, layout2);



            //gauge plot creation

            var trace3 = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: metadataList[indexValue].wfreq,
                    title: { text: "Scrubs per Week", font: { size: 16 } },
                    type: "indicator",
                    mode: "gauge",
                    //   delta: { reference: 380 },
                    //   text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
                    //   direction: 'clockwise',
                    //   textinfo: 'text',
                    //   textposition: 'inside',
                    gauge: {
                        axis: {
                            range: [null, 9],
                            showticklabels: false,
                            // tickmode: "array",
                            // ticks: ""        // Also removes the title!
                        },
                        steps: [
                            { range: [0, 1], color: "#F7F3EC", name: "0-1" },
                            { range: [1, 2], color: "#F3F1E5" },
                            { range: [2, 3], color: "#E8E6CA" },
                            { range: [3, 4], color: "#E5E8B3" },
                            { range: [4, 5], color: "#D9E49E" },
                            { range: [5, 6], color: "#BDCC93" },
                            { range: [6, 7], color: "#9DBE89" },
                            { range: [7, 8], color: "#9ABA90" },
                            { range: [8, 9], color: "#94B38B"  }
                        ],
                        // threshold: {
                        //   line: { color: "red", width: 4 },
                        //   thickness: 0.75,
                        //   value: 490
                        // }
                    }
                }
            ];

            var layout3 = {
                title: {
                    text: "Belly Bottom Washing Frequency",
                    font: {
                        family: 'Verdana',
                        size: 18,
                        //     color: '#7f7f7f'
                    },
                    // margin:{pad:600},
                },
                // width: 600,
                // height: 550,
                margin: { t: 100, b: 0 }
            };

            Plotly.newPlot('gauge', trace3, layout3);


        };


        createPlot(selectedClick);      // generation of the plots
        demographics(selectedClick)     // population of the "Demographic Info" box

    });

}         // End of the managePlot function





manageplot();


