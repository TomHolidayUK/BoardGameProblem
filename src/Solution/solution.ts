// Plan 
// find which squares are blocked (and free)
// find if there is a possible path to the end
// if it is possible find the shortest path to the end


function freeSquares(B: string[]): number[][][] {
    // index = [x,y]
    let startPosition: number[] = []
    let width: number = B[0].length
    let height: number = B.length
    const endPosition: number[] = [width - 1, height - 1]

    // find start position
    B.forEach( (el, index) => 
        el.split('').forEach( (el2, index2) => {
        if (el2 === 'A') {
            startPosition = [index2, index]
        }
    }))

    console.log(`inputs: 
    start = ${startPosition}, 
    end = ${endPosition}, 
    [width, height] = [${width}, ${height}]`)

    // Find blocked squares
    // Squares with a guard on:
    let allBlocked: number[][] = []
    let squaresWithGuards: number[][] = []
    B.forEach( (el, index) => 
        el.split('').forEach( (el2, index2) => {
        if ((el2 === 'X') || (el2 === 'v') || (el2 === '^') || (el2 === '>') || (el2 === '<v>')) {
            squaresWithGuards.push([index2, index])
        }
    }))

    console.log('squaresWithGuards', squaresWithGuards)

    // Squares in line of sight of guard:
    let blockedBySight: number[][] = []
    B.forEach( (el, index) => 
        el.split('').forEach( (el2, index2) => {
        if (el2 === 'v') {
            // x coordinate = index2
            let shouldContinue: boolean = true;
            for (let i = index + 1; i < height; i++) {
                if ((!checkMatrix(squaresWithGuards, [index2, i])) && (shouldContinue === true)) {
                    blockedBySight.push([index2, i])
                } else if (checkMatrix(squaresWithGuards, [index2, i])) {
                    shouldContinue = false
                }
            }
        } else if (el2 === '^') {
            let shouldContinue: boolean = true;
            for (let i = index - 1; i > -1; i--) {
                if ((!checkMatrix(squaresWithGuards, [index2, i])) && (shouldContinue === true)) {
                    blockedBySight.push([index2, i])
                } else if (checkMatrix(squaresWithGuards, [index2, i])) {
                    shouldContinue = false
                }
            }
        } else if (el2 === '>') {
            // x coordinate = index
            let shouldContinue: boolean = true;
            for (let i = index2 + 1; i < width; i++) {
                if ((!checkMatrix(squaresWithGuards, [i, index])) && (shouldContinue === true)) {
                    blockedBySight.push([i, index])
                } else if (checkMatrix(squaresWithGuards, [i, index])) {
                    shouldContinue = false
                }
            }
        } else if (el2 === '<') {
            // x coordinate = index
            let shouldContinue: boolean = true;
            for (let i = index2 - 1; i > -1; i--) {
                if ((!checkMatrix(squaresWithGuards, [i, index])) && (shouldContinue === true)) {
                    blockedBySight.push([i, index])
                } else if (!checkMatrix(squaresWithGuards, [i, index])) {
                    shouldContinue = false
                }
            }
        }
    }))

    console.log('blocked by sight:', blockedBySight)

    allBlocked = squaresWithGuards.concat(blockedBySight) // THIS CONTAINS DUPLICATES!!!!!
    console.log('all blocked:', allBlocked) 

    let freeSquares: number[][] = []

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (!checkMatrix(allBlocked, [j, i])) {
                freeSquares.push([j, i])
            }
        }
    }


    let finalOutput: number[][][] = []
    finalOutput.push(freeSquares)
    finalOutput.push([startPosition, endPosition])

    // [freeSquares, [startPosition, endPosition]]
    return finalOutput
}


function isValid(freeSquares: number [][], positionToCheck: number[]): boolean {
    if (checkMatrix(freeSquares, [positionToCheck[0], positionToCheck[1]])) {
        console.log(`${[positionToCheck[0], positionToCheck[1]]} is free`)
        return true

    } else {
        return false
    }
}


function checkEdgeCases(input: number[][][]): boolean {
    let freeSquares: number [][] = input[0];
    let startPosition: number[] = input[1][0];
    let endPosition: number[] = input[1][1];
    console.log('freeSquares:', freeSquares)
    console.log('startPosition:', startPosition)
    console.log('endPosition:', endPosition)

    // EDGE CASES
    // Is the assasin on a blocked square etc
    if (!checkMatrix(freeSquares, startPosition)) {
        console.log('Assasin is on a blocked square')
        return false
    }

    // Is the final square blocked?
    if (!checkMatrix(freeSquares, endPosition)) {
        console.log('Final Square is blocked')
        return false
    }

    // // Is the assasin already at the end (and the end is free)?
    // if ((startPosition[0] === endPosition[0]) && (startPosition[1] === endPosition[1]) && checkMatrix(freeSquares, endPosition)) {
    //     console.log('Assasin is already on the final square (and the final square is free)')
    //     return true 
    // }

   return true
}


interface Path {
    position: number[];
    direction: string;
}

let currentPath: Path[] = []
let result: Path[] = []

function move(path: Path, newDirection: string): Path {
    if (newDirection === 'up') {
        return {
            position: [path.position[0], path.position[1] - 1],
            direction: newDirection,
          };
    } else if (newDirection === 'down') {
        return {
            position: [path.position[0], path.position[1] + 1],
            direction: newDirection,
          };
    } else if (newDirection === 'left') {
        return {
            position: [path.position[0] - 1, path.position[1]],
            direction: newDirection,
          };
    } else {
        return {
            position: [path.position[0] + 1, path.position[1]],
            direction: newDirection,
          };
    }
}

let possibleRoute: boolean = false;

function findPath(input: number[][][]): Path[] {
    let freeSquares: number [][] = input[0];
    let startPosition: number[] = input[1][0];
    let endPosition: number[] = input[1][1];

    // console.log('freeSquares:', freeSquares)
    // console.log('startPosition:', startPosition)
    // console.log('endPosition:', endPosition)

    let currentPositionObject: Path = {
        position: startPosition,
        direction: '',
    };



    // console.log('currentPosition:', currentPosition)

    // if at the endPosition, return path
    if ((currentPositionObject.position[0] === endPosition[0]) && (currentPositionObject.position[1] === endPosition[1])) {
        console.log('at end position')
        result = currentPath 
        possibleRoute = true
        return currentPath 
    }

    // remove current position from free squares (to avoid going back over it)
    let index = freeSquares.findIndex(arr => JSON.stringify(arr) === JSON.stringify(currentPositionObject.position));
    // console.log('index', index)
    if (index !== -1) {
        freeSquares.splice(index, 1);
        // console.log(`Removed ${JSON.stringify(currentPositionObject.position)}. Updated freeSquares:`, freeSquares);
    } else {
        console.log(`${JSON.stringify(currentPositionObject.position)} not found in freeSquares.`);
    }

    // Iterate through all possible directions
    let nextPosition: number[] = []
    for (let i = 0; i < 4; i++) {
        const directions: string[] = ['down', 'left', 'right', 'up']
        let dy: number[] = [1, 0, 0, -1]
        let dx: number[] = [0, -1, 1, 0]


        nextPosition = [currentPositionObject.position[0] + dy[i], currentPositionObject.position[1] + dx[i]]
        
        // check if next position is valid, if it is recursively call the findPath
        if (isValid(freeSquares, nextPosition)) {
            console.log(`${nextPosition} is valid`)
            let nextPositionObject: Path = {
                position: nextPosition,
                direction: directions[i],
            };
            currentPath.push({ ...nextPositionObject })
            findPath([freeSquares, [nextPosition, endPosition]])
            console.log('backtrack')
            currentPath = currentPath.slice(0, -1);
            // if (currentPath.length === 0) {
            //     console.log('There Are No Possible Routes')
            // }
        } 
    }

    // Mark the current position as free
    freeSquares.push({ ...currentPositionObject.position });
    // console.log(`Added ${JSON.stringify(currentPositionObject.position)}. Updated freeSquares:`, freeSquares);
    
    if ((currentPath.length === 0) && (possibleRoute === false)) {
        console.log('There Are No Possible Routes')
    }

    return currentPath
 
}

// const inputData: string[] = ['...', '>.A']
// const inputData: string[] = ['X.....>', '..v..X.', '.>..X..', 'A......']
const inputData: string[] = ['...Xv', 'AX..^', '.XX..']
// const inputData: string[] = ['A.v', '…']

if (checkEdgeCases(freeSquares((inputData)))) {
    console.log(findPath(freeSquares(inputData)))
} 




function checkMatrix(matrix: number[][], value: number[]): boolean {
    let targetSubarray = value;  
    const includesSubarray = matrix.some(subarray =>
        subarray.length === targetSubarray.length &&
        subarray.every((value, index) => value === targetSubarray[index])
    );
    return includesSubarray
}
