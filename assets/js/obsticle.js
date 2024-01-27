'use strict';

class Obsticle {
    canvas;
    ctx;
    canCollide = true;
    backgroundColor;
    hitbox;

    constructor(ctx, canvas) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    setBounds = (x, y, height, width, color) => {
        this.backgroundColor = {
            fillStyle: color
        }

        this.hitbox = { x, y, height, width }
    }

    update = () => {
    };

    draw = () => {    
        if (this.hitbox) {
            fillRect(this.ctx, { ...this.hitbox, ...this.backgroundColor });
        }
    };

    testCollision = other => {
        if (hasTag(other, 'melling')) {
            return this.hitPosition(other).length > 0;
        }
        
        return false;
    };

    hitPosition = melling => {
        const hits = [];
        if (Math.abs(this.hitbox.x - melling.x) < this.hitbox.width && Math.abs(this.hitbox.y - melling.y) < this.hitbox.height) {
            if (this.hitbox && Math.abs(this.hitbox.y - melling.y) < this.hitbox.height || melling.y < 0) {
                hits.push('TOP');
            }

            if (this.hitbox && Math.abs(this.hitbox.x - melling.x) < melling.width) {
                hits.push('RIGHT');
            }

            if (this.hitbox && Math.abs(this.hitbox.y - melling.y) < melling.height) {
                hits.push('BOTTOM');
            }

            if (this.hitbox && Math.abs(this.hitbox.x - melling.x) < this.hitbox.width || melling.x < 0) {
                hits.push('LEFT');
            }
        }

        return hits;        
    };

    didCollide = (event) => {
        debugger;
        const hit = this.hitPosition(event);

        if (hit.find(x => x === 'TOP')) {
            event.vy = 0;
            event.y = this.hitbox.y + this.hitbox.height;
        }
        
        if (hit.find(x => x === 'RIGHT' || x === 'LEFT')) {
            event.direction = event.direction * -1;
        }
        
        if (hit.find(x => x === 'BOTTOM')) {
            event.vy = 0;
            event.y = this.hitbox.y - event.height;
        }
    };

}
