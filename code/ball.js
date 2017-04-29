/**
 * Created by Eduard on 4/29/2017.
 */

function Level(width, height, actors) {
    this.width = width;
    this.height = height;
    this.actors = actors;
}

// @TODO level collision detection
Level.prototype.obstacleAt = function() {

};

// @TODO object collision detection
Level.prototype.objectAt = function() {

};

Level.prototype.animate = function(step) {
    while(step > 0) {
        var thisStep = Math.min(step, 0.05);
        this.actors.forEach(function(actor) {
            actor.act(thisStep, this);
        }, this);
        step -= thisStep;
    }
};

function Ball(x, y, r, xSpeed, ySpeed) {
    this.r = r || 10;
    this.x = x || r;
    this.y = y || r;
    this.xSpeed = xSpeed || 0;
    this.ySpeed = ySpeed || 0;
}

Ball.prototype.act = function(timeStep, level) {
    this.x = this.x + (this.xSpeed * timeStep);
    this.y = this.y + (this.ySpeed * timeStep);
};

Ball.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    context.stroke();
};

function CanvasDisplay(parent, level) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = level.width;
    this.canvas.height = level.height;
    parent.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    this.level = level;
    this.animationTime = 0;

    this.drawFrame(0);
}

CanvasDisplay.prototype.drawFrame = function(step) {
    this.animationTime += step;
    this.clearDisplay();
    this.drawBackground();
    this.drawObjects();
};

CanvasDisplay.prototype.clearDisplay = function() {
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasDisplay.prototype.drawBackground = function() {
    this.context.strokeStyle = 'black';
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasDisplay.prototype.drawObjects = function() {
    this.level.actors.forEach(function(object) {
        object.draw(this.context);
    }, this)
};

function runAnimation(frameFunction) {
    var lastTime = null;
    function frame(time) {
        if(lastTime != null) {
            var timeStep = Math.min(time - lastTime, 100) / 1000;
            frameFunction(timeStep);
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}