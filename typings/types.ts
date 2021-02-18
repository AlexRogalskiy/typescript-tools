export enum HeroPattern {
    plus = 'plus',
    topography = 'topography',
    texture = 'texture',
    hideout = 'hideout',
    fallingTriangles = 'fallingTriangles',
    iLikeFood = 'iLikeFood',
    fourPointStars = 'fourPointStars',
    brickWall = 'brickWall',
    wiggle = 'wiggle',
    jigsaw = 'jigsaw',
    bubbles = 'bubbles',
    floatingCogs = 'floatingCogs',
    leaf = 'leaf',
    rain = 'rain',
    polkaDots = 'polkaDots',
    ticTacToe = 'ticTacToe',
    overcast = 'overcast',
    formalInvitation = 'formalInvitation',
    jupiter = 'jupiter',
    architect = 'architect',
    cutout = 'cutout',
    graphPaper = 'graphPaper',
    yyy = 'yyy',
    squares = 'squares',
    pianoMan = 'pianoMan',
    pieFactory = 'pieFactory',
    dominos = 'dominos',
    hexagons = 'hexagons',
    charlieBrown = 'charlieBrown',
    autumn = 'autumn',
    temple = 'temple',
    stampCollection = 'stampCollection',
    deathStar = 'deathStar',
    churchOnSunday = 'churchOnSunday',
    overlappingHexagons = 'overlappingHexagons',
    bamboo = 'bamboo',
    bathroomFloor = 'bathroomFloor',
    corkScrew = 'corkScrew',
    happyIntersection = 'happyIntersection',
    kiwi = 'kiwi',
    lips = 'lips',
    lisbon = 'lisbon',
    randomShapes = 'randomShapes',
    steelBeams = 'steelBeams',
    tinyCheckers = 'tinyCheckers',
    xEquals = 'xEquals',
    anchorsAway = 'anchorsAway',
    bevelCircle = 'bevelCircle',
    fancyRectangles = 'fancyRectangles',
    heavyRain = 'heavyRain',
    overlappingCircles = 'overlappingCircles',
    roundedPlusConnected = 'roundedPlusConnected',
    volcanoLamp = 'volcanoLamp',
    cage = 'cage',
    connections = 'connections',
    current = 'current',
    diagonalStripes = 'diagonalStripes',
    flippedDiamonds = 'flippedDiamonds',
    glamorous = 'glamorous',
    houndstooth = 'houndstooth',
    linesInMotion = 'linesInMotion',
    moroccan = 'moroccan',
    morphingDiamonds = 'morphingDiamonds',
    rails = 'rails',
    skulls = 'skulls',
    squaresInSquares = 'squaresInSquares',
    stripes = 'stripes',
    zigZag = 'zigZag',
    aztec = 'aztec',
    bankNote = 'bankNote',
    boxes = 'boxes',
    circlesAndSquares = 'circlesAndSquares',
    circuitBoard = 'circuitBoard',
    curtain = 'curtain',
    diagonalLines = 'diagonalLines',
    endlessClouds = 'endlessClouds',
    eyes = 'eyes',
    floorTile = 'floorTile',
    groovy = 'groovy',
    intersectingCircles = 'intersectingCircles',
    melt = 'melt',
    overlappingDiamonds = 'overlappingDiamonds',
    parkayFloor = 'parkayFloor',
    pixelDots = 'pixelDots',
    signal = 'signal',
    slantedStars = 'slantedStars',
    wallpaper = 'wallpaper',
}

export enum CategoryPattern {
    general = 'general',
    life = 'life',
    success = 'success',
    motivational = 'motivational',
    fun = 'fun',
    programming = 'programming',
    entrepreneurship = 'entrepreneurship',
}

export interface ParsedRequest {
    category?: CategoryPattern | undefined
    width?: string
    height?: string
    colorPattern?: string | string[]
    fontColor?: string | string[]
    backgroundColor?: string | string[]
    pattern?: HeroPattern | undefined
    opacity?: string | string[]
}

export interface ColorOptions {
    readonly colorPattern: string | string[]
    readonly fontColor: string | string[]
    readonly backgroundColor: string | string[]
    readonly opacity: string | string[]
    readonly pattern?: string
}

export interface ImageOptions {
    readonly width: string
    readonly height: string
}

export interface ConfigOptions {
    readonly colorOptions: ColorOptions
    readonly imageOptions: ImageOptions
}
