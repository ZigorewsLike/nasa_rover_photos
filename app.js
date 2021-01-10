new Vue({
    el: '#app',
    data(){
        return{
            dateStep: 0,
            curentDateStr: new Date(Date.now()).toISOString().substring(0,10),
            curentDate: new Date(Date.now()),
            lockDate: new Date(Date.now()),
            dateDivs:{
                collection: [
                    { 
                        text: new Date(Date.now() - 86400000).toISOString().substring(0,10),
                        style:{
                            //color: 'white',
                            cursor: 'pointer',
                        }
                    },
                    { 
                        text: new Date(Date.now()).toISOString().substring(0,10),
                        style:{
                            //color: '#7e7cff',
                            //textDecoration: 'underline',
                            //cursor: 'pointer',
                        }
                    },
                    { 
                        text: new Date(Date.now() + 86400000).toISOString().substring(0,10),
                        style:{
                            //color: 'white',
                            cursor: 'pointer',
                        } 
                    },
                ],
                change: false,
            },
            roverName: 'curiosity',
            posX: 0,
            roverImage: {
                backgroundImage: "url(source/rovers/curiosity.jpg)",
            },
            divPhotos: [],
            divPhotosLen: 0,
            divPhotoLimit: 20,
            divPhotoStep: 0,
        }
    },
    created: function(){
        //this.getImages();
    },
    updated: function () {
        console.log(this.curentDateStr);
        if(new Date(this.curentDate).toISOString().substring(0,10) != this.curentDateStr){
            this.curentDate = new Date(this.curentDateStr);
            if(this.roverName == "opportunity")
                this.lockDate = new Date("2018-06-10");
            else if(this.roverName == "spirit")
                this.lockDate = new Date("2010-03-22");
            else
                this.lockDate = new Date(new Date(Date.now()).toISOString().substring(0,10));
            this.dateStep = Math.ceil((this.lockDate - this.curentDate)/86400000);
            console.log("Update");
            console.log(new Date(this.curentDate));
            if(new Date(this.curentDateStr) > this.lockDate)
                this.curentDateStr = new Date(this.lockDate).toISOString().substring(0,10);
            for(let i=0;i<3;i++){
                this.dateDivs.collection[i].text = new Date(this.lockDate - 86400000 * (this.dateStep+(2-i-1))).toISOString().substring(0,10);
            }
            this.getImages();
        }
        
    },
    watch: {
        posX: function(newValue) {
            for(let i=0; i<3; i++){
                TweenLite.to(cir_shape[i].graphics.command, 0.6, { x: newValue+(clientWidth/6* (i*2+1)), onComplete: function() { 
                    cir_shape[i].graphics.command.x = (clientWidth/6* (i*2+1)); 
                    cir_shape[0].lock = false; 
                } ,onUpdate : function () {
                    if(cir_shape[i].graphics.command.x < 0){
                        cir_shape[i].graphics.command.x += clientWidth;
                    }else if(cir_shape[i].graphics.command.x > clientWidth){
                        cir_shape[i].graphics.command.x -= clientWidth;
                    }
                }});
            }
            console.log("DWIJJ : " + this.posX);
            if(this.posX == 0){
                this.posX = clientWidth/3;
            }else if(this.posX == -1){
                this.posX = -clientWidth/3;
            }
        },
    },
    methods: {
        animCanvas(index){
            if(!cir_shape[0].lock && !(index == 2 && this.dateStep == 0)){
                cir_shape[index].anim = true; 
            }
            else
                cir_shape[index].anim = false;
            
        },
        animCanvasOff(index){
            cir_shape[index].anim = false;
        },
        nextDate(index){
            if(!cir_shape[0].lock){
                cir_shape[index].anim = false;
                if(index == 0){
                    this.dateDivs.change = true;
                    cir_shape[0].lock = true;
                    this.dateStep += 1;
                    this.dateDivs.change = true;
                    cir_shape[0].lock = true; 
                    if(this.posX != 0){
                        this.posX = 0;
                    }else{
                        this.posX += clientWidth/3;
                    }
                    this.getImages();
                }else if(index == 2 && this.dateStep > 0){
                    this.dateDivs.change = true;
                    cir_shape[0].lock = true;
                    this.dateStep -= 1;
                    this.dateDivs.change = true;
                    cir_shape[0].lock = true; 
                    if(this.posX != -1){
                        this.posX = -1;
                    }else{
                        this.posX += clientWidth/3;
                    }
                    this.getImages();
                }
                for(let i=0;i<3;i++){
                    this.dateDivs.collection[i].text = new Date(this.lockDate - 86400000 * (this.dateStep+(2-i-1))).toISOString().substring(0,10);
                }
                if(index == 0){
                    
                }else if(index == 2){
                    
                }
                
            } 
        },
        chooseRover(name){
            this.roverName = name;
        },
        viewRover(name){
            this.roverImage.backgroundImage = 'url(source/rovers/' + name + '.jpg)'
        },
        getImages : async function(){
            let YOUR_KEY = "D6BXaCvYC9sAY8eatWjxLXApUhhNVdPq5yRcmOYm";
            await axios({
                url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + this.roverName + '/photos?earth_date=' 
                + new Date(this.lockDate - 86400000 * (this.dateStep)).toISOString().substring(0,10) 
                + '&api_key=' 
                + YOUR_KEY,
            }).then(response => {
                console.log(response.data);
                this.divPhotos = [];
                //this.roverImage.backgroundImage = "url(" + response.data.photos[0].img_src + ")";
                this.divPhotosLen = response.data.photos.length;
                for(let i=0;i<response.data.photos.length;i++){
                    this.divPhotos.push({
                        nameCamera: response.data.photos[i].camera.full_name,
                        stylePhoto: {
                            backgroundImage: "url(" + response.data.photos[i].img_src + ")",
                        },
                        imgSrc: response.data.photos[i].img_src,
                    });
                }
              }).catch(function(error){
                console.log('api error', error)
            });
        },
    }
});