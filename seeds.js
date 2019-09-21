var mongoose =  require("mongoose"),
Campground=     require("./models/campground"),
Comment=     require("./models/comment");

var data = [
    {
        name: 'Example camp1',
        desc: "That's my fav camp in the Rila Mountains",
        img : 'pic04',
        author:{
            username: 'yolo'
        }
    },
    {
        name: 'Example camp2',
        desc: "That's my fav camp in the OCHRA Lake",
        img : 'pic05',
        author:{
            username: 'Adam1'
        }
    },
]
function seedDB(){
    Campground.remove({}, function(err, campgrounds){
    
        if(err){
            console.log('error from seeds.js')
        }
            console.log('ALL DATA REMOVED THANKS TO SEED')
            console.log('CLEAN ONES COMMING ..... ...... ......');

            data.forEach(function(camp){

                Campground.create(camp, function(err, campground){
            
                    if(err){
                        console.log('error from seeds.js creation')
                    }

                    console.log('clear camps added')

                    Comment.create({
                        text: "first comment",
                        author:{
                            username: 'Homer',
                        }
                    }, function(err, comment){
                        console.log('comment created', comment)
            
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