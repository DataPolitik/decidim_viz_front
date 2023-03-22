# Decidim Viz - Front

## What is Decidim.viz? 

This repository contains the front-end part of Decidim.viz (http://viz.platoniq.net/). This projects aims to develop a dashboard to extract data from Decidim instances (https://meta.decidim.org/). 

Decidim.viz is a dashboard for an instance of Decidim. The objective of Decidim.viz is to provide useful visualizations, metrics and statistical information to interested people.

Decidim.viz is a project promoted by Tecnopolitica.net (research unit Communication Networks and Social Change of Interdisciplinary Internet Institute group at the Universitat Oberta de Catalunya), with the sponsorship of the Office for Digital and Democratic Innovation of the Barcelona city council, and support of initiatives such as the association Heuristica.barcelona and the Platoniq Foundation, in the context of the D2, Data Space and Democracy, its broader aim is to prototype a tool that may contribute to make democratic participation on the Decidim platform more transparent and reflective. 



## Requirements

This front-end is coded in Typescript + Angular. So you need to install Angular in your computer. Typically, you can install Angular with the command `npm install -g @angular/cli`. If you need support, a good place to go is the Angular installation guide https://angular.io/guide/setup-local.

Once Angular is installed, you need to get all the dependencies of the project. In the project folder, execute the following commnad:

`npm install -g @angular/cli`

## Configuration

The folder **/src/app/config/** contains configuration file that you need to adjust before launching or building the application

## Executing

You can execute the front end in your localhost by using the following command:

`npm run`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## About the front-end site

This front-end is connected to a back-end using a REST API. You can download and contribute to the back-end by going to its Github repository: https://github.com/DataPolitik/decidim_viz_back


## Can I contribute?

Sure, please, go to the issues section (https://github.com/DataPolitik/decidim_viz_front/issues) to sse pending task, if you need inspiration. Also, you can propose new tasks by creating a new issue. Please, feel free to implement your contribution and, then, creating a pull request (https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). 

Finally, you can take a look to the document "Desarrollo de Decidim.Viz.pdf" to see the current technical status of the project as well as limitations found.
