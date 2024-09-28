/* WHAT I NEED TO DO:
 * timer
 * highlight previous move
 * show captured pieces on the side
 * have it say white / black to move
 * add touchscreen as well - ontouchstart, ontouchend, ontouchmove, ontouch [0] x, ontouch [0] y
 * show potential moves with purple dots
 *
 * NO:
 * dead position (very difficult)
 * ai
 */

class Chess
  {
    
    static turn = 2;
    static whiteCastleRight = 1;
    static whiteCastleLeft = 1;
    static blackCastleRight = 1;
    static blackCastleLeft = 1;
    static highlight = 0;
    static highlight2 = -1;
    static red = 0;
    static redCount = 0;
    static game = 1;
    static drawCount = 0;
    static movesList = [];
    static pause = 0;
    
    constructor(x, y, type, color)
    {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.passant = 0;
        this.isAlive = 1;
    }

    static changeTurn()
    {
      if (Chess.turn == 2) {Chess.turn = 1;} else {Chess.turn = 2;}
    }
    
    moveTo(x, y)
    {
      this.x = x;
      this.y = y;
    }
    
    realMoveTo(x, y, a)
    {
      if (x==1 && y==1) {Chess.blackCastleLeft = 0;}
      if (x==8 && y==1) {Chess.blackCastleRight = 0;}
      if (x==1 && y==8) {Chess.whiteCastleLeft = 0;}
      if (x==8 && y==8) {Chess.whiteCastleRight = 0;}
      
      if (this.type == 4 && this.x == 1 && this.y == 1 && this.color == 1) {Chess.blackCastleLeft = 0;}
      if (this.type == 4 && this.x == 8 && this.y == 1 && this.color == 1) {Chess.blackCastleRight = 0;}
      if (this.type == 4 && this.x == 1 && this.y == 8 && this.color == 2) {Chess.whiteCastleLeft = 0;}
      if (this.type == 4 && this.x == 8 && this.y == 8 && this.color == 2) {Chess.whiteCastleRight = 0;}
      
      if (this.type == 6 && this.color == 2) {Chess.whiteCastleLeft = 0; Chess.whiteCastleRight = 0;}
      if (this.type == 6 && this.color == 1) {Chess.blackCastleLeft = 0; Chess.blackCastleRight = 0;}
                
      for (let i = 0; i < a.length; i++) {a[i].passant = 0;}
      
      if (this.type == 1 && Math.abs(this.y - y) == 2) {this.passant = 1;}
      
      if (this.type == 1) {Chess.movesList = [];}
      
      this.x = x;
      this.y = y;
    }
    
    promotePawn(t)
    {
      this.type = t;
    }
    
    static drawIm(a)
    {
      const arr = [];
      
      for (let i = 0; i < a.length; i++)
      {
        if (a[i].isAlive == 1 && a[i].type != 6)
        {
          arr[arr.length] = a[i];
        }
      }
      
      if (arr.length == 0) {return true;}
      
      if (arr.length == 1) {return arr[0].type == 2 || arr[0].type == 3;}
      
      return arr.length == 2 && arr[0].type == 3 && arr[1].type == 3 && (arr[0].x + arr[0].y) % 2 == (arr[1].x + arr[1].y) % 2;
      
    }
    
    
    static anyPieceGoTo(x, y, color, a)
    {
      for (let i=0; i<a.length; i++)
        {
          if (!(a[i].color == color) && a[i].canGoTo(x, y, a))
          {
            return true;
          }
        }
        return false;
    }
    
    
    static inCheck(color, a)
    {
        let x = 1;
        let y = 1;

        for (let i=0; i < a.length; i++)
        {
            if (a[i].color == color && a[i].type == 6)
            {
                x = a[i].x;
                y = a[i].y;
            }
        }

        return Chess.anyPieceGoTo(x, y, color, a);
    }
    
   static inRealStalemate(color, a)
    {
        return Chess.inStalemate(color, a) && !Chess.inCheck(color, a);
    }

    static inStalemate(color, a)
    {
        let x = 1;
        let y = 1;

        for (let i=0; i<a.length; i++)
        {
            if (a[i].color==color)
            {
                x = a[i].x;
                y = a[i].y;

                for (let xPos = 1; xPos < 9; xPos++)
                {
                    for (let yPos = 1; yPos < 9; yPos++)
                    {
                        if (a[i].canMoveTo(xPos, yPos, a))
                        {
                          return false;
                        }
                    }
                }
            }
        }
        return true;
    }
 
    static inMate(color, a)
    {
        return Chess.inCheck(color, a) && Chess.inStalemate(color, a);
    }

    
    canMoveTo(newX, newY, a)
    {
        let x = this.x;
        let y = this.y;
        let ic = 999;

        if (this.canGoTo(newX, newY, a) == true)
        {
          for (let i = 0; i < a.length; i++)
          {
            if (a[i].x == newX && a[i].y == newY && a[i].isAlive == 1) {a[i].isAlive = 0; ic = i;}
                                    
            if (this.type == 1 && this.x != newX && a[i].x == newX && a[i].y == this.y && a[i].passant == 1 && a[i].isAlive == 1)
            {a[i].isAlive = 0; ic = i;}
          }  
          this.moveTo(newX, newY);
          
          if (Chess.inCheck(this.color, a))
          {
            this.moveTo(x, y);
            if (ic < 500) {a[ic].isAlive = 1;}
            return false;
          }
          this.moveTo(x, y);
          if (ic < 500) {a[ic].isAlive = 1;}
          return true;
        }

        return false;
    }
    
    
    canGoTo(newX, newY, a)   // the big transition function
    { 
        if (newX > 8 || newX < 1 || newY > 8 || newY < 1 || this.isAlive == 0) {return false;}

        if (this.type == 1) // pawn
        {
            if (this.color == 1) // black
            {
                if (newX == this.x && newY == this.y+1)
                {
                    return !Chess.pieceThere(newX, newY, 1, a) && !Chess.pieceThere(newX, newY, 2, a);
                }

                if (this.y == 2 && newY == this.y+2 && newX == this.x)
                {
                    if (Chess.pieceThere(this.x, this.y+1, 1, a) || Chess.pieceThere(this.x, this.y+1, 2, a)) {return false;}

                    return !Chess.pieceThere(newX, newY, 1, a) && !Chess.pieceThere(newX, newY, 2, a);
                }

                if (Math.abs(newX - this.x) == 1 && newY - this.y == 1)
                {
                  
                  if (!Chess.pieceThere(newX, newY, 2, a))
                  {
                    for (let i = 0; i < a.length; i++)
                    {
                      if (a[i].color == 2 && a[i].passant == 1 && a[i].x == newX && a[i].y == this.y) {return true;}
                    }
                    return false;
                  }
             
                  return Chess.pieceThere(newX, newY, 2, a) && !Chess.pieceThere(newX, newY, 1, a);
                }
            }

            if (this.color == 2) // white
            {
                if (newX == this.x && newY == this.y-1)
                {
                    return !Chess.pieceThere(newX, newY, 1, a) && !Chess.pieceThere(newX, newY, 2, a);
                }

                if (this.y == 7 && newY == this.y-2 && newX == this.x)
                {
                    if (Chess.pieceThere(this.x, this.y-1, 1, a) || Chess.pieceThere(this.x, this.y-1, 2, a)) {return false;}

                    return !Chess.pieceThere(newX, newY, 1, a) && !Chess.pieceThere(newX, newY, 2, a);
                }

                if (Math.abs(newX - this.x) == 1 && this.y - newY == 1)
                {
                  
                  if (!Chess.pieceThere(newX, newY, 1, a))
                  {
                    for (let i = 0; i < a.length; i++)
                    {
                      if (a[i].color == 1 && a[i].passant == 1 && a[i].x == newX && a[i].y == this.y) {return true;}
                    }
                    return false;
                  }  
                  
                  return Chess.pieceThere(newX, newY, 1, a) && !Chess.pieceThere(newX, newY, 2, a);
                }
            }
        }

        if (this.type == 2) // knight
        {
            if ((Math.abs(newX - this.x) == 1 && Math.abs(newY - this.y) == 2) || (Math.abs(newX - this.x) == 2 && Math.abs(newY - this.y) == 1))
            {              
              return !Chess.pieceThere(newX, newY, this.color, a);
              ;
            }

            return false;
        }

        if (this.type == 3) // bishop
        {
            if (!(Math.abs(newX - this.x) / Math.abs(newY - this.y) == 1)) {return false;}

            let numX = (newX - this.x) / Math.abs(newX - this.x);
            let numY = (newY - this.y) / Math.abs(newY - this.y);

            for (let i = 1; i < Math.abs(newX - this.x); i++)
            {
                if (Chess.pieceThere(this.x + numX*i, this.y + numY*i, 1, a)) {return false;}
                if (Chess.pieceThere(this.x + numX*i, this.y + numY*i, 2, a)) {return false;}
            }

            return !Chess.pieceThere(newX, newY, this.color, a);
        }

        if (this.type == 4) // rook
        {
            if (!(newX == this.x ^ newY == this.y)) {return false;}

            let num;

            for (let i = 1; i < Math.max(Math.abs(newX - this.x), Math.abs(newY - this.y)); i++)
            {
                if (newY == this.y)
                {
                    num = (newX - this.x) / Math.abs(newX - this.x);

                    if (Chess.pieceThere(this.x + num*i, this.y, 1, a) || Chess.pieceThere(this.x + num*i, this.y, 2, a)) {return false;}
                }

                if (newX == this.x)
                {
                    num = (newY - this.y) / Math.abs(newY - this.y);

                    if (Chess.pieceThere(this.x, this.y + num*i, 1, a) || Chess.pieceThere(this.x, this.y + num*i, 2, a)) {return false;}
                }
            }

            return !Chess.pieceThere(newX, newY, this.color, a);
        }

        if (this.type == 5) // queen
        {
            if (!(newX == this.x ^ newY == this.y) && !(Math.abs(newX - this.x) / Math.abs(newY - this.y) == 1)) {return false;}

            if (newX == this.x || newY == this.y)
            {
                let num;

                for (let i = 1; i < Math.max(Math.abs(newX - this.x), Math.abs(newY - this.y)); i++)
                {
                    if (newY == this.y)
                    {
                        num = (newX - this.x) / Math.abs(newX - this.x);

                        if (Chess.pieceThere(this.x + num*i, this.y, 1, a) || Chess.pieceThere(this.x + num*i, this.y, 2, a)) {return false;}
                    }

                    if (newX == this.x)
                    {
                        num = (newY - this.y) / Math.abs(newY - this.y);

                        if (Chess.pieceThere(this.x, this.y + num*i, 1, a) || Chess.pieceThere(this.x, this.y + num*i, 2, a)) {return false;}
                    }
                }
            }

            else
            {
                let numX = (newX - this.x) / Math.abs(newX - this.x);
                let numY = (newY - this.y) / Math.abs(newY - this.y);

                for (let i = 1; i < Math.abs(newX - this.x); i++)
                {
                    if (Chess.pieceThere(this.x + numX*i, this.y + numY*i, 1, a)) {return false;}
                    if (Chess.pieceThere(this.x + numX*i, this.y + numY*i, 2, a)) {return false;}
                }
            }

            return !Chess.pieceThere(newX, newY, this.color, a);
        }

        if (this.type == 6) // king
        {
          
          if (newY == this.y && Math.abs(newX - this.x) == 2)
          {
            if (this.color == 2 && newX > this.x)
            {
              return Chess.whiteCastleRight==1 && !Chess.anyPieceGoTo(5, 8, this.color, a) && !Chess.anyPieceGoTo(6, 8, this.color, a) && !Chess.anyPieceGoTo(7, 8, this.color, a);
            }
            
            if (this.color == 2 && newX < this.x)
            {
              return Chess.whiteCastleLeft==1 && !Chess.anyPieceGoTo(5, 8, this.color, a) && !Chess.anyPieceGoTo(4, 8, this.color, a) && !Chess.anyPieceGoTo(3, 8, this.color, a);
            }
            
            if (this.color == 1 && newX > this.x)
            {
              return Chess.blackCastleRight==1 && !Chess.anyPieceGoTo(5, 1, this.color, a) && !Chess.anyPieceGoTo(6, 1, this.color, a) && !Chess.anyPieceGoTo(7, 1, this.color, a);
            }
            
            if (this.color == 1 && newX < this.x)
            {
              return Chess.blackCastleRight==1 && !Chess.anyPieceGoTo(5, 1, this.color, a) && !Chess.anyPieceGoTo(4, 1, this.color, a) && !Chess.anyPieceGoTo(3, 1, this.color, a);
            }
          }
          
          
          return (Math.abs(newX - this.x) < 2 && Math.abs(newY - this.y) < 2) && !(newX == this.x && newY == this.y) && !Chess.pieceThere(newX, newY, this.color, a);
        }

        return false;
    }

   
    static pieceThere(x, y, color, a)
    {
      for (let i=0; i<a.length; i++)
        {
            if (a[i].color == color && a[i].x==x && a[i].y==y && a[i].isAlive == 1)
            {
                return true;
            }
        }

        return false;
    }
  
}

const a = initializeBoard();
drawBoard(a);
document.getElementById("board").style.visibility="visible";
let game = setInterval(myFunction, 1);
Chess.movesList[0] = [];
let c = 0;
          
for (let t = 0; t < a.length; t += 1)
{
  Chess.movesList[0][c] = a[t].x;
  Chess.movesList[0][c+1] = a[t].y;
  Chess.movesList[0][c+2] = a[t].type;
  Chess.movesList[0][c+3] = a[t].isAlive;
  Chess.movesList[0][c+4] = a[t].passant;
  c += 5;
}
Chess.movesList[0][c] = Chess.blackCastleRight;
Chess.movesList[0][c+1] = Chess.blackCastleLeft;
Chess.movesList[0][c+2] = Chess.whiteCastleRight;
Chess.movesList[0][c+3] = Chess.whiteCastleLeft;
Chess.movesList[1] = 1;

document.onmousemove = move;
function move(event)
{
  let mouse = 0;
  for (let x = 1; x < 9 && Chess.highlight != 0; x++)
  {
    for (let y = 1; y < 9; y++)
    {
      let square = x.toString() + "$" + y.toString();
      square = document.getElementById(square);
      
      if (mouseIsOver(square, event)) {Chess.highlight2 = square.id; mouse = 1}
    }
  }
  if (mouse == 0) {Chess.highlight2 = -1}
  
  for (let i = 0; i < a.length && Chess.highlight != 0 && Chess.pause == 0; i++)
  {
    let x = Chess.highlight;
    let y = x.charAt(2);
    x = x.charAt(0);
    x = parseInt(x);
    y = parseInt(y);
    
    if (a[i].x == x && a[i].y == y)
    {
      x = event.clientX + scrollX - 25;
      y = event.clientY + scrollY - 35;
      y = y.toString() + "px";
      x = x.toString() + "px";
      document.getElementById(i.toString()).style.top=y;
      document.getElementById(i.toString()).style.left=x;
      
      drawBoard(a);
    }
  }
}

for(let i=0; i<a.length; i++)
{
  let element = document.getElementById(i.toString());
  element.onmousedown = down;
  function down(event)
  {
    if (Chess.game == 1 && Chess.pause == 0)
    {
      let x = event.clientX + scrollX - 25;
      let y = event.clientY + scrollY - 35;
      y = y.toString() + "px";
      x = x.toString() + "px";
      element.style.top=y;
      element.style.left=x;
      let squareId = a[i].x.toString() + "$" + a[i].y.toString();
      Chess.highlight = squareId;
      document.onmouseup = function() {if (Chess.highlight == squareId) {Chess.highlight = 0; Chess.highlight2 = -1; tryToMove(i, a);}};
    }
  }
}



function myFunction()
{
  if (Chess.inMate(Chess.turn, a))
  {
    Chess.game = 0;
    clearInterval(game);
    setInterval(drawBoard, 1, a);
    if (Chess.turn == 1)
    {setTimeout(function () {alert("Game over. White wins!");}, 100);}
    else {setTimeout(function () {alert("Game over. Black wins!");}, 100);}
  }
  
  if (Chess.inRealStalemate(Chess.turn, a))
  {
    Chess.game = 0;
    clearInterval(game);
    setInterval(drawBoard, 1, a);
    setTimeout(function () {alert("Game over due to stalemate.");}, 100);
  }
  
  if (Chess.drawIm(a))
  {
    Chess.game = 0;
    clearInterval(game);
    setInterval(drawBoard, 1, a);
    setTimeout(function () {alert("Game over due to insufficient mating material.");}, 100);
  }
  
  if (Chess.drawCount > 99)
  {
    Chess.game = 0;
    clearInterval(game);
    setInterval(drawBoard, 1, a);
    setTimeout(function () {alert("Game over because no piece was captured and no pawn moved in the previous 50 moves.");}, 100);
  }
  
  for (let i = 1; i < Chess.movesList.length; i += 2)
  {
    if (Chess.movesList[i] > 2)
    {
      Chess.game = 0;
      clearInterval(game);
      setInterval(drawBoard, 1, a);
      setTimeout(function () {alert("Game over due to repetition.");}, 100);
    }
  }

  drawBoard(a);
}


function arrEquals(arr1, arr2)
{
  if (arr1.length != arr2.length) {return false;}
  for (let i = 0; i < arr1.length; i++)
  {
    if (arr1[i] != arr2[i]) {return false;}
  }
  return true;
}


function mouseIsOver(square, event)
{
  let rect = square.getBoundingClientRect();
  if (event.clientX > rect.x && event.clientX < rect.right && event.clientY > rect.y && event.clientY < rect.bottom)
  {
    return true;
  }
  return false;
}


function tryToMove(i, a)
{
  let square;
  let theId;
  for(let x=1; x<9; x++)
  {
    for(let y=1; y<9; y++)
    {
      
      theId = x.toString()+"$"+y.toString();
      square = document.getElementById(theId);
      
      if (mouseIsOver(square, event))
      {
        if(a[i].canMoveTo(x, y, a) && a[i].color == Chess.turn)
        {
          Chess.drawCount++;
          
          for (let z = 0; z < a.length; z++)
          {
            if (a[z].x == x && a[z].y == y) {a[z].isAlive = 0; Chess.drawCount = 0; Chess.movesList = [];}
            
            if (a[i].type == 1 && a[i].x != x && a[z].x == x && a[i].y == a[z].y && a[z].passant == 1)
            {a[z].isAlive = 0; Chess.drawCount = 0; Chess.movesList = [];}
          }
          
          if (a[i].type == 1) {Chess.drawCount = 0;}
          
          if (a[i].type == 6 && Math.abs(x - a[i].x) == 2)
          {
            for (let z = 0; z < a.length; z++)
            {
              if (a[z].type == 4 && a[z].color == a[i].color && ((a[z].x > a[i].x) == (x > a[i].x)))
              {
                a[z].realMoveTo(x+(Math.abs(a[i].x-x) / (a[i].x-x)), a[z].y, a);
              }
            }
          }
          
          a[i].realMoveTo(x, y, a);
          
          let counter = 1;
          while (counter == 1 && a[i].type == 1 && ((a[i].y == 8 && a[i].color == 1) || (a[i].y == 1 && a[i].color == 2)))
          {
            let prom = prompt("What to promote to?");
            if (prom == "knight") {counter = 0; a[i].promotePawn(2);}
            if (prom == "bishop") {counter = 0; a[i].promotePawn(3);}
            if (prom == "rook") {counter = 0; a[i].promotePawn(4);}
            if (prom == "queen") {counter = 0; a[i].promotePawn(5);}
          }
          
          Chess.movesList[Chess.movesList.length] = [];
          
          let c = 0;
          
          for (let t = 0; t < a.length; t += 1)
          {
            Chess.movesList[Chess.movesList.length-1][c] = a[t].x;
            Chess.movesList[Chess.movesList.length-1][c+1] = a[t].y;
            Chess.movesList[Chess.movesList.length-1][c+2] = a[t].type;
            Chess.movesList[Chess.movesList.length-1][c+3] = a[t].isAlive;
            Chess.movesList[Chess.movesList.length-1][c+4] = a[t].passant;
            c += 5;
          }
          
          Chess.movesList[Chess.movesList.length-1][c] = Chess.blackCastleRight;
          Chess.movesList[Chess.movesList.length-1][c+1] = Chess.blackCastleLeft;
          Chess.movesList[Chess.movesList.length-1][c+2] = Chess.whiteCastleRight;
          Chess.movesList[Chess.movesList.length-1][c+3] = Chess.whiteCastleLeft;
          
          Chess.movesList[Chess.movesList.length] = 1;
          
          for (let t = 0; t < Chess.movesList.length - 2; t += 2)
          {
            if (arrEquals(Chess.movesList[t], Chess.movesList[Chess.movesList.length - 2])) {Chess.movesList[t+1]++;}
          }
          
          Chess.changeTurn();
          for (let xPos = 1; xPos < 9; xPos++)
          {
            for (let yPos = 1; yPos < 9; yPos++)
            {
              let square2 = document.getElementById(xPos.toString() + "$" + yPos.toString());
              if ((xPos + yPos) % 2 == 1) {square2.style.backgroundColor="#ab8a68";}
              else {square2.style.backgroundColor="#e6cdb4";}
            }
          }
          
          Chess.pause = 1;
          setTimeout(function() {if (Chess.game == 1) {Chess.pause = 0;} drawBoard(a);}, 100);
        } else
        {
          let xCount = a[i].x;
          let yCount = a[i].y;
    
          xCount = xCount.toString();
          yCount = yCount.toString();
          let thatObject = document.getElementById(xCount+"$"+yCount);
          
          let rect = thatObject.getBoundingClientRect();
          let xPos = rect.x +  + 5;
          let yPos = rect.y + scrollY  - 5;
          xPos = xPos.toString() + "px";
          yPos = yPos.toString() + "px";
    
         document.getElementById(i.toString()).style.left=xPos;
         document.getElementById(i.toString()).style.top=yPos;
          
          
          if((a[i].x + a[i].y) % 2 == 1)
          {thatObject.style.backgroundColor="#ab8a68";}
          else {thatObject.style.backgroundColor="#e6cdb4";}
          
          if ((x != a[i].x || y != a[i].y) && Chess.game == 1)
          {
            let squareColor = "#e6cdb4";
            if ((x + y) % 2 == 1) {squareColor = "#ab8a68";}
            square.style.backgroundColor="#Bf3232";
            Chess.red = square.id;
            Chess.redCount++;
          
            for (let xPos = 1; xPos < 9; xPos++)
            {
              for (let yPos = 1; yPos < 9; yPos++)
              {
                let square2 = document.getElementById(xPos.toString() + "$" + yPos.toString());
                if (Chess.red != square2.id)
                 {
                   if ((xPos + yPos) % 2 == 1) {square2.style.backgroundColor="#ab8a68";}
                   else {square2.style.backgroundColor="#e6cdb4";}
                 }
              }
            }
            
            setTimeout(function()
            {
              Chess.redCount--;
              if (Chess.redCount == 0)
              {
                theId = x.toString()+"$"+y.toString();
                square = document.getElementById(theId);
                square.style.backgroundColor=squareColor;
                Chess.red = 0;
              }
            }, 400);
          }
        }
      } else
      {
        let xCount = a[i].x;
        let yCount = a[i].y;
  
        xCount = xCount.toString();
        yCount = yCount.toString();
        let thatObject = document.getElementById(xCount+"$"+yCount);
          
        let rect = thatObject.getBoundingClientRect();
        let xPos = rect.x + scrollX + 5;
        let yPos = rect.y + scrollY - 5;
        xPos = xPos.toString() + "px";
        yPos = yPos.toString() + "px";
    
        document.getElementById(i.toString()).style.left=xPos;
        document.getElementById(i.toString()).style.top=yPos;
        
        if((a[i].x + a[i].y) % 2 == 1)
        {thatObject.style.backgroundColor="#ab8a68";}
        else {thatObject.style.backgroundColor="#e6cdb4";}
      }
    }
  }
}


function drawBoard(a)
{ 
  if (window.innerWidth >= 480)
  {
    document.body.style.overflowX="hidden";
    document.getElementById("board").style.left="calc(50% - 240px)";
  }
  else
  {
    document.body.style.overflowX="scroll";
    document.getElementById("board").style.left="0px";
  }
  
  if (window.innerHeight >= 480)
  {
    document.body.style.overflowY="hidden";
    document.getElementById("board").style.top="calc(50% - 240px)";
  }
  else
  {
    document.body.style.overflowY="scroll";
    document.getElementById("board").style.top="0px";
  }
  
  if (Chess.inCheck(2, a))
 {
   document.getElementById("1").style.textShadow="1px 1px 1.5px #Bf3232, -1px -1px 1.5px #Bf3232, -1px 1px 1.5px #Bf3232, 1px -1px 1.5px #Bf3232";
 }
  else {document.getElementById("1").style.textShadow="";}
  
  if (Chess.inCheck(1, a))
  {
    document.getElementById("0").style.textShadow="1px 1px 1.5px #Bf3232, -1px -1px 1.5px #Bf3232, -1px 1px 1.5px #Bf3232, 1px -1px 1.5px #Bf3232";
  }
  else {document.getElementById("0").style.textShadow="";}
  
  const arr1 = document.getElementsByClassName("white");
  const arr2 = document.getElementsByClassName("black");
  
  let xCount;
  let yCount;
  let xPosit;
  let yPosit;
  let rect;
  let thatObject;
  let uni;
  let square;
  
  for (let i = 0; i < arr1.length; i++)
  {
    xPosit = arr1[i].id;
    yPosit = xPosit.charAt(2);
    xPosit = xPosit.charAt(0);
    xPosit = parseInt(xPosit) - 1;
    yPosit = parseInt(yPosit) - 1;
    
    if (Chess.turn == 1) {xPosit = 7-xPosit; yPosit = 7-yPosit;}
    if (Chess.pause == 1) {xPosit = 7-xPosit; yPosit = 7-yPosit;}
    
    xPosit *= 60;
    yPosit *= 60;
    
    xPosit = xPosit.toString() + "px";
    yPosit = yPosit.toString() + "px";
    
    arr1[i].style.top=yPosit;
    arr1[i].style.left=xPosit;
  }
  
  for (let i = 0; i < arr2.length; i++)
  {
    xPosit = arr2[i].id;
    yPosit = xPosit.charAt(2);
    xPosit = xPosit.charAt(0);
    xPosit = parseInt(xPosit) - 1;
    yPosit = parseInt(yPosit) - 1;
    
    if (Chess.turn == 1) {xPosit = 7-xPosit; yPosit = 7-yPosit;}
    if (Chess.pause == 1) {xPosit = 7-xPosit; yPosit = 7-yPosit;}
    
    xPosit *= 60;
    yPosit *= 60;
   
    xPosit = xPosit.toString() + "px";
    yPosit = yPosit.toString() + "px";
    
    arr2[i].style.top=yPosit;
    arr2[i].style.left=xPosit;
  }
  
  for (let xPos = 1; xPos < 9; xPos++)
  {
    for (let yPos = 1; yPos < 9; yPos++)
    {
      square = document.getElementById(xPos.toString() + "$" + yPos.toString());
      if (Chess.red != square.id)
      {
        if ((xPos + yPos) % 2 == 1) {square.style.backgroundColor="#ab8a68";}
        else {square.style.backgroundColor="#e6cdb4";}
      }
    }
  }
  
  if (Chess.highlight != 0)
  {
    document.getElementById(Chess.highlight).style.backgroundColor="#967694";
    if (Chess.highlight2 != -1)
    {
      document.getElementById(Chess.highlight2).style.backgroundColor="#967694";
    }
  }
  
  for (let i = 0; i < a.length && Chess.highlight == 0; i++)
  {
    xPosit = a[i].x - 1;
    yPosit = a[i].y - 1;
    
    if (Chess.turn == 1) {xPosit = 7-xPosit; yPosit = 7-yPosit;}
    if (Chess.pause == 1) {xPosit = 7-xPosit; yPosit = 7-yPosit;}
    
    xPosit *= 60;
    yPosit *= 60;
    
    xPosit += 5;
    yPosit -= 5;
    
    if (window.innerWidth >= 480)
    {
      xPosit = xPosit - 240;
      xPosit = "calc(50% + " + xPosit.toString() + "px)";
      document.getElementById(i.toString()).style.left=xPosit;
    }
    else
    {
      xPosit = xPosit.toString() + "px";
      document.getElementById(i.toString()).style.left=xPosit;
    }
    
    if (window.innerHeight >= 480)
    {
      yPosit = yPosit - 240;
      yPosit = "calc(50% + " + yPosit.toString() + "px)";
      document.getElementById(i.toString()).style.top=yPosit;
    }
    else
    {
      yPosit = yPosit.toString() + "px";
      document.getElementById(i.toString()).style.top=yPosit;
    }
    
    if (a[i].type == 2 && a[i].color == 2) {document.getElementById(i).innerHTML = "&#9816";}
    if (a[i].type == 3 && a[i].color == 2) {document.getElementById(i).innerHTML = "&#9815";}
    if (a[i].type == 4 && a[i].color == 2) {document.getElementById(i).innerHTML = "&#9814";}
    if (a[i].type == 5 && a[i].color == 2) {document.getElementById(i).innerHTML = "&#9813";}

    if (a[i].type == 2 && a[i].color == 1) {document.getElementById(i).innerHTML = "&#9822";}
    if (a[i].type == 3 && a[i].color == 1) {document.getElementById(i).innerHTML = "&#9821";}
    if (a[i].type == 4 && a[i].color == 1) {document.getElementById(i).innerHTML = "&#9820";}
    if (a[i].type == 5 && a[i].color == 1) {document.getElementById(i).innerHTML = "&#9819";}
    
    if (a[i].isAlive == 0)
    {
      document.getElementById(i.toString()).style.display = "none";
    }
  }
}


function initializeBoard()
    {
        const a = [];

        a[0] = new Chess(5, 1, 6, 1); // black king
        a[1] = new Chess(5, 8, 6, 2); // white king

        a[2] = new Chess(1, 1, 4, 1); // black pieces
        a[3] = new Chess(2, 1, 2, 1);
        a[4] = new Chess(3, 1, 3, 1);
        a[5] = new Chess(4, 1, 5, 1);
        a[6] = new Chess(6, 1, 3, 1);
        a[7] = new Chess(7, 1, 2, 1);
        a[8] = new Chess(8, 1, 4, 1);

        a[9] = new Chess(1, 2, 1, 1); // black pawns
        a[10] = new Chess(2, 2, 1, 1);
        a[11] = new Chess(3, 2, 1, 1);
        a[12] = new Chess(4, 2, 1, 1);
        a[13] = new Chess(5, 2, 1, 1);
        a[14] = new Chess(6, 2, 1, 1);
        a[15] = new Chess(7, 2, 1, 1);
        a[16] = new Chess(8, 2, 1, 1);

        a[17] = new Chess(1, 8, 4, 2); // white pieces
        a[18] = new Chess(2, 8, 2, 2);
        a[19] = new Chess(3, 8, 3, 2);
        a[20] = new Chess(4, 8, 5, 2);
        a[21] = new Chess(6, 8, 3, 2);
        a[22] = new Chess(7, 8, 2, 2);
        a[23] = new Chess(8, 8, 4, 2);

        a[24] = new Chess(1, 7, 1, 2); // white pawns
        a[25] = new Chess(2, 7, 1, 2);
        a[26] = new Chess(3, 7, 1, 2);
        a[27] = new Chess(4, 7, 1, 2);
        a[28] = new Chess(5, 7, 1, 2);
        a[29] = new Chess(6, 7, 1, 2);
        a[30] = new Chess(7, 7, 1, 2);
        a[31] = new Chess(8, 7, 1, 2);

        return a;
    }
