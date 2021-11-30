# SRA-Explorer

Mini web application to explore the [NCBI Sequence Read Archive](https://www.ncbi.nlm.nih.gov/sra) and easily access downloads for data, either as `.sra` files from the NCBI or as `.fastq` via the [EBI ENA](https://www.ebi.ac.uk/ena).

This tool should out of the box, entirely in your browser with no need for any back-end setup. You can use it in two ways:

1. Directly on the web: http://sra-explorer.info/
2. Download the `index.html` file and load in your web browser.

SRA-Explorer was a fun mini-project done in my spare time. If you have found it useful, why not [tag me in a tweet](https://twitter.com/tallphil) 😁

## Packages used

All the code relating to the SRA API calls are taken from [Labrador](https://github.com/ewels/labrador). The page is built using the [Bootstrap](http://getbootstrap.com) CSS framework and all of the interaction magic happens using [AngularJS](https://angularjs.org). The copy to clipboard buttons are powered by [Clipboard.js](https://clipboardjs.com/).

## Alternatives

If you're here a lot, it may be worth taking a look at some excellent command-line alternatives. For example:

* [nf-core/fetchngs](https://nf-co.re/fetchngs)
* [pysradb](https://github.com/saketkc/pysradb)
* [fetchfastq](https://github.com/pachterlab/ffq)

These tools are more scalable and stable than SRA-Explorer.
