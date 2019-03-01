var g = 9.82;     // Gravitation
var h = 0.01;     // Step length

class Pendulum
{
  constructor(ang0, v0, length, mass, length_mass, friction, inertia) {
    this.angle = [ang0];
    this.velocity = [v0];
    this.acceleration = [0];
    this.length = length;
    this.mass = mass;
    this.length_mass = length_mass;
    this.friction = friction;
    this.inertia = inertia;
    this.update = this.update.bind(this);
  }

  update(){
    var next_acc = (-(g/this.length*Math.sin(this.angle.last()) - this.friction*this.velocity.last() + Math.sign(this.velocity.last())*this.impulse_force/this.inertia));
    this.acceleration.push(next_acc);
    this.velocity.push(euler(this.velocity.last(), this.acceleration.last(), h));
    this.angle.push(euler(this.angle.last(), this.velocity.last(), h));
  }

  get impulse_force(){
    if ((this.velocity.last()*this.angle.last() < 0) && (Math.abs(this.angle.last()) > 0.4)) {
      return 0.495; //Magic number
    }
    else {
      return 0;
    }
  }

  get_impulse_force(){
    return this.impulse_force;
  }

}

class Cog
{

  constructor(ang0, v0, inertia) {
    this.angle = [ang0];
    this.velocity = [v0];
    this.acceleration = [0];
    this.inertia = inertia;
    this.update = this.update.bind(this);
  }

  update(impulse_force){
    var next_acc = (0.5 - impulse_force/this.inertia);
    this.acceleration.push(next_acc);
    this.velocity.push(euler(this.velocity.last(), this.acceleration.last(), h));
    this.angle.push(euler(this.angle.last(), this.velocity.last(), h));
  }

}

function euler(x, f, h){

  var x_next = (x + h*f);
  return x_next;
}

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

var p1 = new Pendulum(-0.5, 0, 1, 1, 1, 0.04, 1);
var c1 = new Cog(0, 0, 1);

//Render loop
for(i = 0; i < 100; i++)
{
  p1.update();
  c1.update(p1.get_impulse_force());
}
