
// Creation of a dashboard displaying information for an individual selected in a dropdown menu. 
// The underlaying data is a JSON file accessible by its URL.

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Injection of new lines in the html code to create paragraphs in the "Demographic Info" box that will be dynamically populated later
document.querySelector('#sample-metadata').insertAdjacentHTML(
    'afterbegin', `
    <p id="id" style="padding-left: 10px;"></p>
    <p id='ethnicity' style="padding-left: 10px;"></p>
    <p id='gender' style="padding-left: 10px;"></p>
    <p id='location' style="padding-left: 10px;"></p>
    <p id='age' style="padding-left: 10px;"></p>
    <p id='bbtype' style="padding-left: 10px;"></p>
    <p id='wfreq' style="padding-left: 10px;"></p>
    `);


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
        let selector = d3.select("#selDataset");
        if (document.querySelector('#selDataset').hasChildNodes() == false) {              // Need to test if the dropdown does not already exist or it will append the full list at each selection again and again 
            Object.values(nameIdList).map(item => item).forEach(d => {
                selector.append("option").attr("value", nameIdList.indexOf(d)).text(d); // Based on how the json data is structured (an object containing three arrays),
            })
        };                                                                        // the only thing linking the values across the arrays is their position in each array.
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
            var trace1 = [{
                y: listTop10.map(object => `OTU ${object.otu_ids}`),
                x: listTop10.map(object => object.sample_values),
                text: listTop10.map(object => object.otu_labels),
                type: "bar",
                orientation: 'h'
            }];

            var layout = {
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
            var trace2 = [{
                x: newList.map(object => object.otu_ids),
                y: newList.map(object => object.sample_values),
                text: newList.map(object => object.otu_labels),
                mode: 'markers',
                marker: {
                    size: newList.map(object => object.sample_values),
                    color: newList.map(object => object.otu_ids)
                }
            }];

            var layout2 = {
                title: `Bacterial distribution for Subject ID No: ${sampleList[indexValue].id}`,
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
                    gauge: {
                        axis: {
                            range: [null, 9],
                            showticklabels: true,
                            dtick: { tick0: 1 },
                            ticklen: 3,

                            // The following options do not improve the appearance of the plot
                            // ticks: "inside",        // Also removes the title if set to ""!
                            // tickmode: "array",
                            // ticktext: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
                            // tickvals: [0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5]
                        },

                        steps: [
                            { range: [0, 1], color: "#F7F3EC" },
                            { range: [1, 2], color: "#F3F1E5" },
                            { range: [2, 3], color: "#E8E6CA" },
                            { range: [3, 4], color: "#E5E8B3" },
                            { range: [4, 5], color: "#D9E49E" },
                            { range: [5, 6], color: "#BDCC93" },
                            { range: [6, 7], color: "#9DBE89" },
                            { range: [7, 8], color: "#9ABA90" },
                            { range: [8, 9], color: "#94B38B" }
                        ],
                    }
                }
            ];

            var layout3 = {
                title: {
                    text: "Belly Bottom Washing Frequency",
                    font: {
                        family: 'Verdana',
                        size: 18,
                    },
                },
                margin: { t: 100, b: 0 }
            };

            Plotly.newPlot('gauge', trace3, layout3);
        };


        createPlot(selectedClick);      // generation of the plots
        demographics(selectedClick)     // population of the "Demographic Info" box

    });

};         // End of the managePlot function




// Function called when the selection on the dropdown menu changes
manageplot();


