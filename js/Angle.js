var g = 9.82;     // Gravitation
var h = 0.001;     // Step length
var contactAngle = 0.045;

class Pendulum
{
  constructor(ang0, v0, mass, length_mass, anchor_radius, anchor_angle, friction) {
    this.angle = ang0;
    this.velocity = v0;
    this.acceleration = 0;
    this.mass = mass;
    this.anchor_radius = anchor_radius;
    this.anchor_angle = anchor_angle;
    this.length_mass = length_mass; //Length to the center of mass
    this.friction = friction; //Teckenfel
    this.inertia = mass * Math.pow(length_mass, 2);

    this.update = this.update.bind(this);
    this.get_impulse_force = this.get_impulse_force.bind(this);
  }

  update(cog_acceleration, cog_radius){
    var gravity_torque = -g*this.mass*Math.sin(this.angle)*this.length_mass;
    var friction_torque = this.friction*this.velocity;
    var impulse_torque = Math.sign(this.velocity)*this.get_impulse_force(cog_acceleration, cog_radius)*this.anchor_radius;
    //this.acceleration = (gravity_torque - friction_torque + impulse_torque)/this.inertia;
    this.acceleration = gravity_torque / this.inertia;
    //this.acceleration = -(g/this.length*Math.sin(this.angle) - this.friction*this.velocity + Math.sign(this.velocity)*this.impulse_force/this.inertia);
    this.velocity = euler(this.velocity, this.acceleration, h);
    this.angle = euler(this.angle, this.velocity, h);
  }

  get_impulse_force(cog_acceleration, cog_radius){
    if ((this.velocity*this.angle) < 0 && Math.abs(this.angle) > contactAngle){
      var c = 3;
      return c * Math.sin(this.anchor_angle) * cog_acceleration / cog_radius;
    }
    else {
      return 0;
    }
  }
}

class Cog
{

  constructor(r, m) {
    this.angle = 0;
    this.velocity = 0;
    this.acceleration = 0;
    this.radius = r;
    this.mass = m;
    this.inertia = this.mass * Math.pow(this.radius, 2) * 0.5; // We assume that the cog wheel has a uniform density
    this.update = this.update.bind(this);
  }

  update(mass_torque){
    this.acceleration = mass_torque/this.inertia; //We do not account for impulse_force since it is applied almost paralell to the radius
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

class Mass {
  constructor(m, y0, r, floorY) {
    this.m = m;           //Mass
    this.y0 = y0;         //Starting position
    this.y = y0;          //Current position
    this.r = r;           //Radius of the spool
    this.floorY = floorY; //Position of the floor
    this.torque = 0;
    this.update = this.update.bind(this);
  }

  update(ang){
    if (this.y > this.floorY) {
      this.y = this.y0 - ang*this.r;
      this.torque = g*this.m*this.r;
    } else {
      this.torque = 0;
    }
  }
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
