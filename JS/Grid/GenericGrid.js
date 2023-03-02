class GridOccupant{
    width;
    height;
    rotation;
    object;

    constructor(object,width,height,rotation){
        this.resize(width,height);
        this.rotation = rotation;
    }

    resize(width,height){
        this.width = width;
        this.height = height;
    }

    readWidth(){
        if(this.rotation%2 == 0){
            return this.width;
        }
        else{
            return this.height;
        }
    }

    readHeigth(){
        if(this.rotation%2 == 0){
            return this.height;
        }
        else{
            return this.width;
        }
    }

    rotateClockwise(amount){
        this.rotation = (this.rotation+amount)&0b11;
    }
}

class GenericGrid{
    static VACANT_INDEX = -1;

    width;

    cells;//Array of Number
    slotContent;//Array of Object

    constructor(width,height){
        this.resize(width,height);
    }

    resize(width,height){
        this.width = width;
        let totalSize = width*height;
        this.cells = new Array(totalSize).fill(GenericGrid.VACANT_INDEX);
        this.slotContent = new Array(totalSize);//Worst case Scenario
    }

    cellIndex(x,y){
        return x+y*this.width;
    }

    read_Cell(x,y){
        return this.cells[this.cellIndex(x,y)];
    }

    read_Slot(index){
        return this.slotContent[index];
    }

    read_CellSlot(x,y){
        return this.read_Slot(this.read_Cell(x,y));
    }

    read_AreaIsVacant(x1,y1,x2,y2){
        for(let x = x1;x<x2;x++){
            for(let y = y1;y<y2;y++){
                if(this.read_Cell(this.cellIndex(x,y)) != GenericGrid.VACANT_INDEX){
                    return false;
                }
            }
        }
        return true;
    }

    write_Cell(x,y,index){
        this.cells[this.cellIndex(x,y)] = index;
    }

    write_Slot(index,object){
        this.slotContent[index] = object;
    }

    write_CellSlot(x,y,index,object){
        this.write_Cell(x,y,index);
        this.write_Slot(index,object);
    }

    write_AreaCells(x1,y1,x2,y2,index){
        for(let x = x1;x<x2;x++){
            for(let y = y1;y<y2;y++){
                this.write_Cell(x,y,index);
            }
        }
    }

    putGridOccupant(x,y,index,gridOccupant){
        this.write_Slot(index,object);
        this.write_AreaCells(x,y,x+gridOccupant.readWidth(),y+gridOccupant.readHeigth());
    }

    removeFirstGridOccupant(index){
        let gridOccupant = this.read_Slot(index);
        this.write_Slot(index,undefined);

        let firstSlot = 0;

        for(let i = 0;i<this.cells.length;i++){
            if(this.cells[i] == index){
                firstSlot = index;
                break;
            }
        }

        let x = firstSlot%this.width;
        let y = (firstSlot-x)/this.width;

        this.write_AreaCells(x,y,x+gridOccupant.readWidth(),y+gridOccupant.readHeigth(),GenericGrid.VACANT_INDEX);
    }

    toPrintable(){
        let output = new String();

        let widthHolder = this.width;
        let cellsHolder = this.cells;
        let slotsHolder = this.slots;

        let verticalWall = "|";
        let horizontalWall = "-";
        let corner = "+";
        let empty = ".";

        let currentCell = 0;

        for(let h = 0;h<cellsHolder.length/widthHolder;h++){
            if(h==0) {
				output += corner;
				for(let i = 0;i<widthHolder;i++) {
					output += horizontalWall;
				}
				output += `${corner}\n${verticalWall}`;
			}
            else {
				output += verticalWall;
			}
			for(let w = 0;w<widthHolder;w++) {
                currentCell = cellsHolder[w+h*widthHolder];
                if(currentCell != GenericGrid.VACANT_INDEX){
                    output += currentCell.toString(36);
                }
                else{
                    output += empty;
                }
				
			}
			output += verticalWall+"\n";
			if(h+1==cellsHolder.length/widthHolder) {
				output += corner;
				for(let i = 0;i<widthHolder;i++) {
					output += horizontalWall;
				}
				output += corner;
			}
        }

        return output;
    }
}

let gg = new GenericGrid(9,9);

gg.write_AreaCells(2,2,5,5,10)

console.log(gg.read_AreaIsVacant(3,3,5,5))

console.log(gg.toPrintable());