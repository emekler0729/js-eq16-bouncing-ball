/**
 * Created by Eduard on 4/29/2017.
 */

function Level(width, height, objects) {
    this.width = width;
    this.height = height;
    this.objects = objects;
}

Level.prototype.detectCollision = function(object) {
    var xCollision, yCollision = false;

    if(object.x - object.r < 0 || object.x + object.r >= this.width) {
        xCollision = true;
    }

    if(object.y - object.r < 0 || object.y + object.r >= this.height) {
        yCollision = true;
    }

    this.objects.forEach(function(other) {
        if(other != object) {
            var dx = Math.abs(object.x - other.x);
            var dy = Math.abs(object.y - other.y);
            var distance = Math.sqrt(dx * dx + dy * dy);
            if(distance < object.r + other.r) {
                var angle = Math.tan(dy/dx);

                if(angle >= 7/4*Math.PI && angle < Math.PI/4 || angle >= 3/4*Math.PI && angle < 5/4*Math.PI) {
                    xCollision = true;
                    other.xSpeed = -other.xSpeed;
                } else {
                    yCollision = true;
                    other.ySpeed = -other.ySpeed;
                }
            }
        }
    });

    if(xCollision && yCollision) {
        return "xy";
    } else if (xCollision) {
        return 'x';
    } else if (yCollision) {
        return 'y';
    } else {
        return null;
    }
};

Level.prototype.animate = function(step) {
    while(step > 0) {
        var thisStep = Math.min(step, 0.05);
        this.objects.forEach(function(object) {
            object.act(thisStep, this);
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

    var collision = level.detectCollision(this);

    switch(collision) {
        case "xy":
            this.xSpeed = -this.xSpeed;
            this.ySpeed = -this.ySpeed;
            break;
        case 'x':
            this.xSpeed = -this.xSpeed;
            break;
        case 'y':
            this.ySpeed = -this.ySpeed;
            break;
    }
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
    this.level.objects.forEach(function(object) {
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