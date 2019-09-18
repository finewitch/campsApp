var mongoose =  require("mongoose"),
Campground=     require("./models/campground"),
Comment=     require("./models/comment");

var data = [
    {
        name: 'Example camp1',
        desc: "That's my fav camp in the Rila Mountains",
        img : 'images/pic04.jpg'
    },
    {
        name: 'Example camp2',
        desc: "That's my fav camp in the OCHRA Lake",
        img : 'images/pic05.jpg'
    },
]
function seedDB(){
    Campground.remove({}, function(err, campgrounds){
    
        if(err){
            console.log('error from seeds.js')
        }
            console.log('all removed!')
            console.log('preaparing to add new ones .....');

            data.forEach(function(camp){

                Campground.create(camp, function(err, campground){
            
                    if(err){
                        console.log('error from seeds.js creation')
                    }

                    console.log('clear camps added')

                    Comment.create({
                        text: "first comment",
                        author: "HOmer"
                    }, function(err, comment){
            
                        if(err){
                         console.log('error while adding comment in seed.js')
                        }
                        campground.comments.push(comment);
                        campground.save();
                        console.log('NEW COMMENT created, we reached the end ');
                    })
                    })
        
            })

    })
    
}
module.exports = seedDB;