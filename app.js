//express
const express = require('express');
const app = express();
const port = 3000;
app.use(express.static("public")); //for loading css in folder public

//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); //for selecting input attrubite name 

//ejs
const ejs = require('ejs');
app.set('view engine', 'ejs'); //for folder view

//lodash
const _ = require('lodash');

//mongoose                              //Step1
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mrtnprzk:mrtnprzk@cluster0.coymc.mongodb.net/blogDB');

  //Schema
  const composeSchema = new mongoose.Schema({
    title: String,
    post: String
  });

  //Model
  const Compose = mongoose.model('Compose', composeSchema);

//Lorem Text
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


//routes -----------------------------------
app.get('/', (req, res) => {                //Step2

  Compose.find({}, function(err, foundComposes){
    if (err) {
      console.log(err)
    } else{
      res.render('home', {homeParagraph: homeStartingContent, composePosts: foundComposes});
    }
  });
});

app.get('/post/:postId', (req, res) => { // :title -> we can put here any word
                                         //Step4
    const id = req.params.postId;

    Compose.findById(id, function (err, compose){
      if (err) {
        console.log(err)
      } else {
        if (id === compose.id) {
          res.render('post', {title: compose.title, content: compose.post});
        } 
      }
    })
})
 
app.get('/contact', (req, res) => {
  res.render('contact', {contactParagraph: contactContent});
});

app.get('/about', (req, res) => {
  res.render('about', {aboutParagraph: aboutContent});
});

app.get('/compose', (req, res) => {
  //page to create post
  res.render('compose');
});

app.post('/compose', (req, res) => {      //Step1

  //selecting value of inputs
  const post = {
    titleText: req.body.titleText,
    postText: req.body.postText
  };

  //creating new compose with model
  const composeNew = new Compose ({
    title: post.titleText,
    post: post.postText
  })

  //pushing object into database + redirect
  composeNew.save(function(err){              //Step3
    if (!err) {           
      res.redirect('/');
    }
  });
})

//---------------------------------------------
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


//Challenge
//Step 1 - Save Composed Posts with MongoDB
//Step 2 - Get the Home Page to Render the Posts
//Step 3 - Fix the Bug (Add a callback to the save method to only redirect to the home page once save is complete with no errors.)
//Step 4 - Render the correct blog post based on post_id