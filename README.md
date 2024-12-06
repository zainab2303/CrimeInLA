We analyzed crime data in Los Angeles using R (ggplot2) and d3.js for interactive visualizations to explore how factors like race, gender, area, and time influence crime trends and victim susceptibility. Our study examined the impact of COVID-19 on crime rates, progression of neighborhood crime over the years, and demographic factors affecting sexual crime susceptibility. We also identified safer neighborhoods based on crime prevalence. Our dataset can be found here: https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8 


To replicate our results:
- In the additional_scripts you will find the file 'cleaning.qmd' we use to run our graphs.
- A smaller sized file created from our cleaned dataset is stored in 'Safety.csv'. The steps to recreate this can be found in 'MakingSafetycsv.qmd' in the addition_scripts folder. 
- To run the interactive plot please select the AM-PM button and then click on the desired time button to view the risk of crime for each gender!

![Local Image](Images/mosaic.png)

![Local Image](Images/spatial_plot.png)

![Local Image](Images/alluvialplot.png)
