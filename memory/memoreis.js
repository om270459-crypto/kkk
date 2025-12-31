const box = document.querySelector(".christmas-box");
const snow = box.querySelector(".snow");
const spark = box.querySelector(".spark");
const sctx = snow.getContext("2d");
const pctx = spark.getContext("2d");

/* ===== Resize ===== */
function resize(){
    snow.width = box.clientWidth;
    snow.height = box.clientHeight;
    spark.width = box.clientWidth;
    spark.height = box.clientHeight;
}
resize();
window.addEventListener("resize", resize);

/* ===== Snow ===== */
let flakes=[];
for(let i=0;i<80;i++){
    flakes.push({
        x:Math.random()*snow.width,
        y:Math.random()*snow.height,
        r:Math.random()*3+1,
        s:Math.random()*1.5+.5,
        d:Math.random()*0.5
    });
}
function snowLoop(){
    sctx.clearRect(0,0,snow.width,snow.height);
    sctx.fillStyle="white";
    flakes.forEach(f=>{
        sctx.beginPath();
        sctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        sctx.fill();
        f.y+=f.s;
        f.x+=Math.sin(f.y*f.d);
        if(f.y>snow.height){ f.y=-5; f.x=Math.random()*snow.width; }
    });
    requestAnimationFrame(snowLoop);
}
snowLoop();

/* ===== Spark ===== */
let sparks=[];
function spawn(x,y){
    for(let i=0;i<6;i++){
        sparks.push({x,y,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,life:40});
    }
}
function sparkLoop(){
    pctx.clearRect(0,0,spark.width,spark.height);
    sparks.forEach((s,i)=>{
        pctx.fillStyle="gold";
        pctx.fillRect(s.x,s.y,2,2);
        s.x+=s.vx; s.y+=s.vy; s.life--;
        if(s.life<=0) sparks.splice(i,1);
    });
    requestAnimationFrame(sparkLoop);
}
sparkLoop();
setInterval(()=>{
    const star = box.querySelector(".star").getBoundingClientRect();
    const rect = box.getBoundingClientRect();
    spawn(star.left-rect.left+star.width/2, star.top-rect.top+star.height/2);
},300);

/* ===== Parallax ===== */
box.addEventListener("mousemove",e=>{
    const r = box.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    box.style.transform = `rotateY(${x*14}deg) rotateX(${-y*14}deg) translateY(-10px)`;
});
box.addEventListener("mouseleave",()=>{ box.style.transform=""; });

/* ===== Typewriter ===== */
function typeWriter(el, text, speed){
    let i=0;
    function type(){
        if(i<text.length){
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

setTimeout(()=>{
    const textElements = box.querySelectorAll("h2, p");
    textElements.forEach(el=>{
        const text = el.textContent;
        el.innerHTML="";
        const speed = el.tagName==="H2"?60:30;
        typeWriter(el,text,speed);
    });
},2000); // يبدأ بعد فتح البوكس