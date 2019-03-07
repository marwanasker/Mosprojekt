var g = 9.82;     // Gravitation
var h = 0.01;     // Step length
var contactAngle = 0.042;

class Pendulum
{
  constructor(ang0, v0, length, mass, length_mass, friction, inertia) {
    this.angle = ang0;
    this.velocity = v0;
    this.acceleration = 0;
    this.length = length;
    this.mass = mass;
    this.length_mass = length_mass;
    this.friction = -friction; //Teckenfel
    this.inertia = inertia;
    this.update = this.update.bind(this);
  }

  update(){
    this.acceleration = -(g/this.length*Math.sin(this.angle) - this.friction*this.velocity + Math.sign(this.velocity)*this.impulse_force/this.inertia);
    this.velocity = euler(this.velocity, this.acceleration, h);
    this.angle = euler(this.angle, this.velocity, h);
  }

  get impulse_force(){
    if ((this.velocity*this.angle) < 0 && Math.abs(this.angle) > contactAngle){
      return -0.035; //Magic number, teckenfel
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
    this.angle = ang0;
    this.velocity = v0;
    this.acceleration = 0;
    this.inertia = inertia;
    this.update = this.update.bind(this);
  }

  update(impulse_force){
    this.acceleration = (1.8 - impulse_force/this.inertia);
    this.velocity = euler(this.velocity, this.acceleration, h);
    this.angle = euler(this.angle, this.velocity, h);
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

function modulus(a, b) {
  while (a > b) {
    a = a - b;
  }
  return Math.abs(a);
}

/*
var p1 = new Pendulum(-0.5, 0, 1, 1, 1, 0.04, 1);
var c1 = new Cog(0, 0, 1);

//Render loop

for(i = 0; i < 100; i++)
{
  p1.update();
  c1.update(p1.get_impulse_force());
}
*/
