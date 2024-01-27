'use strict';

class WorldBoundary {
    canvas;
    ctx;
    canCollide = true;
    backgroundColor;
    topBoundary = null;
    rightBoundary = null;
    bottomBoundary = null;
    leftBoundary = null;
    tags = ['worldboundary'];

    constructor(ctx, canvas) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    setBoundary = (top, right, bottom, left, width, color) => {
        this.backgroundColor = {
            fillStyle: color
        }

        if (top) {
            this.topBoundary = { x: 0, y: 0, height: width, width: this.canvas.width }
        } else {
            this.topBoundary = null;
        }
        
        if (right) {
            this.rightBoundary = { x: this.canvas.width - width, y: 0, height: this.canvas.height, width: width }
        } else {
            this.rightBoundary = null;
        }

        if (bottom) {
            this.bottomBoundary = { x: 0, y: this.canvas.height - width, height: width, width: this.canvas.width }
        } else {
            this.bottomBoundary = null;
        }
        
        if (left) {
            this.leftBoundary = { x: 0, y: 0, height: this.canvas.height, width: width }
        } else {
            this.leftBoundary = null;
        }
    }

    update = () => {
    };

    draw = () => {    
        if (this.topBoundary) {
            fillRect(this.ctx, { ...this.topBoundary, ...this.backgroundColor });
        }
        
        if (this.rightBoundary) {
            fillRect(this.ctx, { ...this.rightBoundary, ...this.backgroundColor });
        }

        if (this.bottomBoundary) {
            fillRect(this.ctx, { ...this.bottomBoundary, ...this.backgroundColor });
        }
        
        if (this.leftBoundary) {
            fillRect(this.ctx, { ...this.leftBoundary, ...this.backgroundColor });
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
        if (this.topBoundary && Math.abs(this.topBoundary.y - melling.y) < this.topBoundary.height || melling.y < 0) {
            hits.push('TOP');
        }

        if (this.rightBoundary && Math.abs(this.rightBoundary.x - melling.x) < melling.width) {
            hits.push('RIGHT');
        }

        if (this.bottomBoundary && Math.abs(this.bottomBoundary.y - melling.y) < melling.height) {
            hits.push('BOTTOM');
        }

        if (this.leftBoundary && Math.abs(this.leftBoundary.x - melling.x) < this.leftBoundary.width || melling.x < 0) {
            hits.push('LEFT');
        }

        return hits;        
    };

    didCollide = (event) => {
        const hit = this.hitPosition(event);

        if (hit.find(x => x === 'TOP')) {
            event.vy = 0;
            event.y = this.topBoundary.y + this.topBoundary.height;
        }
        
        if (hit.find(x => x === 'RIGHT' || x === 'LEFT')) {
            event.direction = event.direction * -1;
        }
        
        if (hit.find(x => x === 'BOTTOM')) {
            event.vy = 0;
            event.y = this.bottomBoundary.y - event.height;
        }
    };

}
