const colors = ['blue','green','red','yellow'];

const randomcolor = ()=>{
    return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomcolor;