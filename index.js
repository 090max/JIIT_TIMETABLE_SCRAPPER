const express=require('express');
var bodyParser=require('body-parser');
const xl = require('xlsx');
app=express();
var path=require('path');

//BODY PARSER MIDDLEWARE

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//app.use(express.static(__dirname));

const workbook = xl.readFile(path.join(__dirname,"Public/table.xls"));
const sheet_name_list=workbook.SheetNames;
var sheet=xl.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

function get_batch(batch,match)
{
   //console.log(" "+batch);
   var type=batch[0];
   var comb_batch_arr=["ABC","AB","BC","AC"];
   batch=batch.substring(1,batch.length+1);
   var temp_batch=batch.split(",");
   var bat=null;
   var match_number=match.substring(1,batch.length+1);
    var batch_number=parseInt(match_number,10);
    var start=null;
    var end=null;
    var found=0;
   var current_bat=null;
   for(i in temp_batch)
   {
      var inner_batch=temp_batch[i].split("-");
      if(inner_batch[0][0].charCodeAt(0)>=65 && inner_batch[0][0].charCodeAt(0)<=90)
      bat=inner_batch[0][0];
      if(inner_batch.length>1)
      {
      	if(inner_batch[0]==match)found=1;
      	   
           //console.log("ss"+bat.concat(inner_batch[1]));
        else if(bat.concat(inner_batch[1])==match && type!="L")found=1;    
	
      	else if(type=="L")                                                                         //If it is a lecture
      	{
      		start=inner_batch[0].substring(1,inner_batch[0].length+1);
      		end=inner_batch[1];
      		start=parseInt(start,10);
      		end=parseInt(end,10);
      		if(match[0]==bat && batch_number>=start && batch_number<=end)
      		{
      			found=1;
      		}
      	}
      }
      else
      {
      	//console.log("DDDDDDDDDD "+inner_batch[0])
      	
      	if(inner_batch[0]==match)found=1;
 
      else if(inner_batch[0]=="ABC" ||inner_batch[0]=="AB" || inner_batch[0]=="BC"||inner_batch[0]=="AC" ){
      	 
      	for(var x=0;x<inner_batch[0].length;x++)
      	{
      		if(inner_batch[0][x]==match[0]){
      			found=1;
      			break;}
      	}
      }
           	else if(current_bat!=null )
      	{
      		if(current_bat.concat(inner_batch[0])==match)found=1;
      	else if(match[0]==bat && inner_batch[0].length==1)
      		found=1;

      }
      current_bat=bat;
      /*console.log("curr"+current_bat);
      *///console.log(current_bat);
   }
   return found;
}
}

var time_array=new Array();
var temp_time=0;
for(i in sheet[0]){

	var z=sheet[0][i].toString();
	
	time_array.push({z:temp_time++});
}
//console.log(time_array[0]);
var day_arr={'MON':0,'TUE':1,'WED':2,'THU':3,'FRI':4,'SAT':5};
var count=0;
var time_var=0;
var day=0;
var pos_end=null;
var subject=new Array();

var time_table=new Array();//THE MAIN ARRAY;
for(var ind=0;ind<8;ind++)
{
	time_table[ind]=new Array();
}
for(const i in sheet)
{

	for(const j in sheet[i])
	{
		//console.log(sheet[i][j]);
            
            if(i==0)break;	
           if(sheet[i][j].length==3)
           {
           	
           	var temp=day_arr[sheet[i][j]];
           	if(temp>=0 && temp<=5)
           	{
           		day=temp;
           		
           		
           	}
           }
       

			
			
			var text=sheet[i][j];
			
			var lect_reg=/\((.*?)\)/;
			var lect=text.match(lect_reg);
            
            
            var room_reg1=/\/(.*?)\//;
            var room_reg2=/\-(.*?)\//;
            var room_reg3=/\)(.*?)\//;
            var room=text.match(room_reg1);
            if(room==null)
            room=text.match(room_reg2);
            if(room==null)
            	room=text.match(room_reg3);

           var batch_reg=/(.*)\(/;
            var batch=text.match(batch_reg);
            if(batch!=null)
            {
            
           
           if(get_batch(batch[1],"B11"))
           {
                var last_digit;
                if(j[j.length-1].charCodeAt(0)!=89)
                last_digit=parseInt(j[j.length-1],10);
                else last_digit=0;
                var ob_table={week_day:day,time:sheet[0][j],type:batch[1][0],lecture:lect[1],room_given:room[1]};
                
                time_table[last_digit].push(ob_table);
                //console.log(last_digit+" "+sheet[0][j]+" "+lect[1]+" "+room[1]+" "+batch[1][0]);
           }
           }

           if(sheet[i][j]=="SHORT FORM")
           {
           	pos_end=i;
           	break;
           	i=sheet.length;
           }


}
}

//console.log(pos_end);
var count=0;
var subj_arr=new Array();
for(i=pos_end;i<sheet.length;i++)
{
	for(j in sheet[i])
	{
		if(sheet[i][j]!="SHORT FORM" && sheet[i][j]!="SUBJECT CODE" && sheet[i][j]!="SUBJECT NAME"){
		subj_arr[count++]=sheet[i][j];
		if(count==3)
		{
			subject.push(subj_arr[0],subj_arr[2]);
			count=0;
		} 
		}

	}
	
}


console.log(time_table);

//console.log(subject);

//console.log(count);


/*
if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile(path.join(__dirname,'Public/table1.xls'));
console.log(workbook.A1);*/

app.listen(3000,function()
{
	console.log("server started");
});