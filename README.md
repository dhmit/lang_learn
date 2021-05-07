# Machine Learning Applications for Remote Language Instruction

_Machine Learning Applications for Remote Language Instruction_ is a project by the
[MIT Programs in Digital Humanities](https://digitalhumanities.mit.edu) in
collaboration with our Spring 2021 Faculty Fellow, [Takako Aikawa](https://aikawa.mit.edu/),
Senior Lecturer in Japanese in the Global Languages Department at MIT.

## Instructions for Setting Up Google Images Search
To get images for the modules, our project uses the
(GoogleImagesSearch)[https://pypi.org/project/Google-Images-Search/]
Python library. Here is how you get and set up the environment
variables in order for it to work:

1. Visit https://console.developers.google.com and create a project.
2. Visit https://console.developers.google.com/apis/library/customsearch.googleapis.com
   and enable "Custom Search API" for your project.
3. Visit https://console.developers.google.com/apis/credentials and
   generate API key credentials for your project. You can get the GOOGLE_API_KEY from here.
4. Visit https://cse.google.com/cse/all and add a search engine. Then,
   edit your search engine to enable "Image Search", "Safe Search", and
   "Search Entire Web".
5. On that same page, you should see the "Search Engine ID". That is
   your SEARCH_CX.
6. Go to the root directory of the repo and add a .env file. It should contain:
```
GOOGLE_API_KEY=<your_google_api_key>
SEARCH_CX=<your_search_cx>
```
7. Test that it worked by running the project, going to the Instructor View,
creating a new text, and checking the images for a word.
