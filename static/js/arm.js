var ros;
var robot_IP;

window.onload = function () {
  //IP de la compu donde esta corriendo ros bridge 192.168.1.6
  robot_IP = "localhost";

  ros = new ROSLIB.Ros({
      url: "ws://" + robot_IP + ":9090"
  });

var listener3 = new ROSLIB.Topic({
    ros : ros,
    name : '/zedArm/zed_arm/left/image_rect_color/compressed',
    messageType : 'sensor_msgs/CompressedImage'
  });

listener3.subscribe(function(message) {
  //document.getElementById("liveimage").innerHTML = m.data;
  console.log("image listenerr event fired");
  var imagedata = "data:image/png;base64," + message.data;
  document.getElementById("imgArm").src = imagedata;      
  //document.getElementById("liveimage").src =  m.data;      
});

var pub_q1 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint1',
    messageType : 'Float64',
    queue_size: 1   
});
var pub_q2 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint2',
    messageType : 'Float64',
    queue_size: 1   
});
var pub_q3 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint3',
    messageType : 'Float64',
    queue_size: 1   
});
var pub_q4 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint4',
    messageType : 'Float64',
    queue_size: 1   
});
var pub_q_string = new ROSLIB.Topic({
    ros : ros,
    name : 'inverse_kinematics/Q',
    messageType : 'String',
    queue_size: 1   
});
//gripper rotacion
var joint5 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint5',
    messageType : 'Float64',
    queue_size: 1   
});
//lineal 
var gripper = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/gripper',
    messageType : 'Float64',
    queue_size: 1   
});
//lineal 
var lineal = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/prism',
    messageType : 'Float64',
    queue_size: 1   
});
}

var gripper_apertur = 60;   //0 y 60
var values_map = {
        joint1: .134,   //.4
        joint2: 0,      //.9
        joint3: .647,
        joint4: 0,      //phi
        joint5: 1500,   //rotacion
    };

var l1 = 0;
var l2 = 2.6;
var l3 = 2.6;
var l4 = .9;

var limits_map = {
        q1:[-90,90],
        q2:[0,161],
        q3:[-165.4,0],
        q4:[-90,90],
        joint5:[1000,2000] //Tambien tengo 500 y 2500
    };

var angles_map={
        q1:0,
        q2:161,
        q3:-165.4,
        q4:8
    };
var limit_z = -4.2;
var limit_chassis = 1.1; //11cm del chasis

function PresionadoDerecha(self, id){
    console.log(print("presionado" + id));

    var x = values_map.joint1;
    var y = values_map.joint2;
    var z = values_map.joint3;
    var phi = values_map.joint4;

    if (id === "HOME"){
        x = .134;
        y =  0;
        z =  .647;
        phi = 0;
    } else if(id === "INTERMEDIO"){
        x = 0;
        y = 0;
        z = 3.677;
        phi = 0;
    }else if(id === "PULL"){
        x = 3.33;
        y = 0;
        z = 3.35;
    }else if (id === "WRITE"){
        x = 3.33;
        y = 0;
        z = 1.35;
    }else if (id === "FLOOR"){
        x = 3.28
        y = 0
        z = -2.37
        phi = -90
    }else if (id === "STORAGE"){
        phi = 90
    }
    values_map.joint1 = x;
    values_map.joint2 = y;
    values_map.joint3 = z;
    values_map.joint4 = phi;
    ikine_brazo(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4); //falta
    labelInfo.config(text=getTxt()); //falta
}

function publish_angles(){
    var q1 = angles_map.q1;
    var q2 = angles_map.q2;
    var q3 = angles_map.q3;
    var q4 = angles_map.q4;

    //txt = str(q1)+" "+str(q2)+" "+str(q3)+" "+str(q4)
    //rospy.loginfo(txt)

    pub_q1.publish(q1);
    pub_q2.publish(q2);
    pub_q3.publish(q3);
    pub_q4.publish(q4);
    pub_q_string.publish(txt);
}

function qlimit(l, val){
    if (val < l[0]){
        return l[0];
    }
    if (val > l[1]){
        return l[1];
    }
    return val;
} 

function pressed(data, joint, sign = 1){
    var key = "joint" + String(joint);
    if(joint === 6){
        data*=-1;
        gripper.publish(data);       
    }
    /*if(data != 0):
        self.S1labelj6.config(bg="#34eb61")
    else:
        self.S1labelj6.config(bg="white")
    return None*/
    if(joint === 7){
        data*=-1;
        lineal.publish(data);
        return null;
    }

    if(joint === 4){
        var prev = values_map[key];
        values_map[key] = data;
        //var poss = ikine_brazo(values_map.joint1, values_map.joint2, values_map.joint3, self.values_map.joint4);            
        if(!poss){
            values_map[key] = prev;
        }
    }else{  
        values_map[key] += (data*(sign*-1))
    } 
    
    if(joint < 4){
        //var poss = ikine_brazo(values_map.joint1, values_map.joint2, values_map.joint3, self.values_map.joint4);          
        if(!poss){
            values_map[key]+=(data*(sign));
        }
    }

    /*if(joint === 1){    
        if(data !== 0){
            S1labelj1.config(bg="#34eb61")
        } else {
            S1labelj1.config(bg="white")
        }
    }elif(joint == 2):
        if(data != 0):
            self.S1labelj2.config(bg="#34eb61")
        else:
            self.S1labelj2.config(bg="white")
    elif(joint == 3):
        if(data != 0):
            self.S1labelj3.config(bg="#34eb61")
        else:
            self.S1labelj3.config(bg="white")
    elif(joint == 4):            
        if(data != 0):
            self.S1labelj4.config(bg="#34eb61")
        else:
            self.S1labelj4.config(bg="white")
    elif(joint == 5):
        self.values_map[key] = self.qlimit(self.limits_map[key], self.values_map[key])
        self.joint5.publish(self.values_map[key])            
        
        if(data != 0):
            self.S1labelj5.config(bg="#34eb61")
        else:
            self.S1labelj5.config(bg="white")*/

    labelInfo.config(text=self.getTxt())
}

function getTxt(){
    publish_angles();
    var txt = "Position X = " + String(Math.round(values_map.joint1,2)) + "\n"+"Position Y = " + 
        String(Math.round(values_map.joint2,2)) + "\n" + "Position Z = " + String(Math.round(values_map.joint3,2)) + "\n";
    txt += "Position Phi = " + String(values_map.joint4)+ "\n" + "Rotacion del gripper = " + String(values_map.joint5) + "\n";
    txt += "q1:" + String(Math.round(angles_map.q1,2)) + "\nq2:" + String(Math.round(angles_map.q2,2)) + "\n";
    txt += "q3:"+ String(Math.round(angles_map.q3,2)) + "\nq4:" + String(Math.round(self.angles_map.q4,2));
    return txt;
}



function rad2deg(radians){return radians * (180/math.pi);}


//Example: inverseKinematics(1.4,.3,2,1)
function inverseKinematics(xm, ym, zm, phi_int){     
  let Q1 = 0;
  if (xm != 0 || ym != 0 || zm != 0){
    if(xm == 0){
      if(ym>0){
        xm = ym;
        Q1 = math.pi/2;
      }else if (ym<0){
        xm = ym;
        Q1 = math.pi/2;
      }else if(ym == 0){
        Q1 = 0; 
      }
    }else if (xm < 0){
      if (ym == 0){
        Q1 = 0;
      }else if(ym < 0){
        //No lo he cambiado #real
        Q1 = math.re(math.atan2(xm, ym));
      }else{
        //Tampoco lo he cambiado #real
        Q1 = math.re(math.atan2(-xm,-ym));
      }
                    
    }else{
      //Ni idea #real
      
      Q1 = math.re(math.atan2(ym,xm));
    }  
  }    
  //Para q1
  let q1=rad2deg(Q1)
  //q1=self.qlimit(self.limits_map["q1"],q1)
  //Para q2
  let hip=math.sqrt(math.pow(xm,2)+math.pow((zm-l1),2));
  let phi = math.complex(math.atan2(zm-l1, xm))
  //beta=acos((-l3^2+l2^2+hip^2)/(2*l2*hip))
  let beta=math.acos((math.pow(l2,2)+math.pow(hip,2)-math.pow(l3,2))/(2*l2*hip));
  let Q2=math.add(phi,beta).re;//math.re(phi+beta);
  let q2=rad2deg(Q2) 
  //let q2=self.qlimit(self.limits_map["q2"],q2)

  //Para q3  
  let gamma=math.acos((math.pow(l2,2)+math.pow(l3,2)-math.pow(hip,2))/(2*l2*l3));   
  let Q3=math.re(gamma-math.pi);
  let q3=rad2deg(Q3);
  //let q3=self.qlimit(self.limits_map["q3"],q3)
  let q4 = phi_int - q2 -q3;
  //q4=self.qlimit(self.limits_map["q4"],q4)
  console.log("angulos: "+q1 + " "+ q2 + " "+q3+" "+q4);
  return Q1;              
}
