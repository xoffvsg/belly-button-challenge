
// Creation of a horizontal bar chart from an url with a dropdown menu to display the top 10 OTUs found in that individual

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



// *****   Identifies the corresponding key   *****

function optionChanged(selectedClick){
    console.log(`optionChanged function: ${selectedClick}`);     // to be removed
    return selectedClick
    };  

// var x =d3.select()


d3.json(url).then(function(dataSet) {
    var nameIdList = dataSet.names;
    var metadataList = dataSet.metadata;
    var sampleList = dataSet.samples;

    // console.log(nameIdList);     // to be removed
    // console.log(metadataList);     // to be removed
    // console.log(sampleList);     // to be removed

// *****   Population of the Dropdown menu   *****

let selector = d3.select("#selDataset");
Object.values(nameIdList).map(item => item).forEach(d=>{
    selector.append("option").attr("value", nameIdList.indexOf(d)).text(d);
    // console.log(d);     // to be removed
});

// var idSelected= optionChanged();
// console.log(idSelected);

// selector.on("change", function(){
//     let selectedName = selector.property("value");
//     console.log(selectedName);


// *****   Populates the demographic info   *****

let listMeta = d3.select(".panel-body");


var indexValue = 15;         // To be linked to the dropdown selection


// listMeta.attr('width', 'fit-content');
listMeta.append("p").text(`id: ${metadataList[indexValue].id}`);
listMeta.append("p").text(`ethnicity: ${metadataList[indexValue].ethnicity}`);
listMeta.append("p").text(`gender: ${metadataList[indexValue].gender}`);
listMeta.append("p").text(`age: ${metadataList[indexValue].age}`);
listMeta.append("p").text(`location: ${metadataList[indexValue].location}`);  
listMeta.append("p").text(`bbtype: ${metadataList[indexValue].bbtype}`);  
listMeta.append("p").text(`wfreq: ${metadataList[indexValue].wfreq}`); 


// Identification of top 10


// *****   Creation of the plots   *****

function creatPlot(indexValue){

    var newList = [];
    for (var j=0; j<sampleList[indexValue].sample_values.length; j++)
        newList.push({'otu_ids': sampleList[indexValue].otu_ids[j], 'sample_values': sampleList[indexValue].sample_values[j],'otu_labels':sampleList[indexValue].otu_labels[j]});
    
        // Identification of top 10
    let listTop10 = newList.sort((a, b) => b.sample_values - a.sample_values).slice(0,10).reverse();

    // console.log('listTop10')     // to be removed
    // console.log(listTop10)     // to be removed
    // console.log(newList)     // to be removed

    // bar graph creation
    trace1 = [{
        y: listTop10.map(object => `OTU ${object.otu_ids}`),
        x: listTop10.map(object => object.sample_values),
        text: listTop10.map(object => object.otu_labels),
        type: "bar",
        orientation: 'h'
    }];

    let layout = {
        title: sampleList[indexValue].id,
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };

    Plotly.newPlot("bar", trace1, layout);


    //bubble plot creation

    trace2=[{
        
        x: newList.map(object => object.otu_ids),
        y: newList.map(object => object.sample_values),
        text: newList.map(object => object.otu_labels),
        mode: 'markers',
        marker:{
            size: newList.map(object => object.sample_values),
            color: newList.map(object => object.otu_ids)
            }
        }];
    
    console.log('trace2.x')     // to be removed
    console.log(newList.map(object => object.otu_ids))     // to be removed
    console.log('trace2.y')     // to be removed
    console.log(newList.map(object => object.sample_values))     // to be removed

    let layout2 = {
        title: sampleList[indexValue].id,
        margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
        }
    };
    Plotly.newPlot("bubble", trace2, layout2);


};




creatPlot(indexValue);





});         // End of d3.json






// // selector.on("change", function(){
// //     let selectedName = selector.property("value");
// //     console.log(selectedName);


//     // creatPlot(data[selectedName], selectedName.toUpperCase());
// // });




