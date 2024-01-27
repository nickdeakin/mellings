'use strict';

class Melling {
    canvas;
    ctx;
    canCollide = true;
    x = 0;
    y = 0;
    width = 20;
    height = 20;
    gap = 0;
    color = 'white';
    hitbox;
    direction = 1;
    gravity = 0.1
    vy = 0;
    tags = ['melling'];

    constructor(ctx, canvas) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    spawn = (x, y) => {
        this.x = x;
        this.y = y;
    };

    update = () => {
        this.vy += this.gravity;
        this.y += this.vy;

        if (Math.abs(this.vy) < .2) {
            this.x += 2 * this.direction;
        }
    }

    draw = () => {
        this.hitbox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fillStyle: this.color
        };

        fillRect(this.ctx, this.hitbox);
    };

    testCollision = other => {
        if (!this.hitbox) {
            return false;
        }
/*
        const hit = other.x - this.x + (other.radius * 2) > 0 && Math.abs(other.x - (other.radius * 2) - this.x) < this.width
                 && other.y - this.y + (other.radius * 2) > 0 && Math.abs(other.y - (other.radius * 2) - this.y) < this.height

        if (hit) {
            return this.hitDirection(other);
        }
        */
        return false;
    };

    hitDirection = other => {
        const otherCenterX = other.x + other.radius;
        const otherCenterY = other.y + other.radius;

        const leftTest = other.vx < 0 ? 999 : Math.abs(this.x - (otherCenterX + (other.radius / 2)) );
        const rightTest = other.vx > 0 ? 999 : Math.abs((this.x + this.width) - other.x);

        const topTest = other.vy < 0 ? 999 :  Math.abs(this.y - (otherCenterY + (other.radius / 2)) );
        const bottomTest = other.vy > 0 ? 999 : Math.abs((this.y + this.height) - other.y);

        const smallest = Math.min(...[leftTest, rightTest, topTest, bottomTest]);

        if (smallest === rightTest) {
            return 'RIGHT';
        }
        if (smallest === leftTest) {
            return 'LEFT';
        }
        if (smallest === topTest) {
            return 'TOP';
        }
        if (smallest === bottomTest) {
            return 'BOTTOM';
        }
        return 'UNKNOWN';
    };

    didCollide = (event, direction) => {
        if (direction === 'LEFT' || direction === 'RIGHT') {
            event.vx = event.vx * -1;
        } else if(direction === 'TOP' || direction === 'BOTTOM') {
            event.vy = event.vy * -1;
        }
        this.lives--;
        this.scoreDelegate(this.score);
    };
}
