CREATE
//m3 j1
(j1m3:Junction{name:'M3 J1',number:1,road:'M3',instruct:false}),
(j1x1:Exit{number:1}),
(j1e2:Entrance{number:2}),
(j1x3:Exit{number:3}),
(j1e4:Entrance{number:4}),
(j1x5:Exit{number:5}),
(j1e6:Entrance{number:6}),
(j1x7:Exit{number:7}),
(j1e8:Entrance{number:8}),
(j1x9:Exit{number:9}),
(j1e10:Entrance{number:10}),
(j1x11:Exit{number:11}),
(j1e12:Entrance{number:12}),
(j1x13:Exit{number:13}),
(j1e14:Entrance{number:14}),

//m3 j2
(j2m3:Junction{name:'M3 J2',number:2,road:'M3',instruct:false}),
(j2x1:Exit{number:1}),
(j2e2:Entrance{number:2}),
(j2x3:Exit{number:3}),
(j2e4:Entrance{number:4}),
(j2x5:Exit{number:5}),
(j2e6:Entrance{number:6}),
(j2x7:Exit{number:7}),
(j2e8:Entrance{number:8}),

//m25 j11
(j11m25:Junction{name:'M25 J11',number:11,road:'M25',instruct:false}),
(j11x1:Exit{number:1}),
(j11e2:Entrance{number:2}),
(j11x3:Exit{number:3}),
(j11e4:Entrance{number:4}),
(j11x5:Exit{number:5}),
(j11e6:Entrance{number:6}),
(j11x7:Exit{number:7}),
(j11e8:Entrance{number:8}),

//m25 j12 - has same exits/entrances as m3 j2
(j12m25:Junction{name:'M25 J12',number:12,road:'M25',instruct:false}),

// junctions off m25 j11

// Hatch Farm
(j_hfr:Junction{name:'Hatch Farm Roundabout',instruct:true}),
(j_hfrx1:Exit{number:1}),
(j_hfre2:Entrance{number:2}),
(j_hfrx3:Exit{number:3}),
(j_hfre4:Entrance{number:4}),
(j_hfrx5:Exit{number:5}),
(j_hfre6:Entrance{number:6}),
(j_hfrx7:Exit{number:7}),
(j_hfre8:Entrance{number:8}),
(j_hfrx9:Exit{number:9}),
(j_hfre10:Entrance{number:10}),

// Addlestone Moor
(lh50:Location{number:50,street:'Addlestone Moor',local:'Chertsey',postcode:'KT15 2QH'}),
(lh49:Location{number:49,name:'The Woburn Arms',street:'Addlestone Moor',local:'Chertsey',postcode:'KT15 2QH'}),
(lh48:Location{number:48,street:'Addlestone Moor',local:'Chertsey',postcode:'KT15 2QH'}),

// Staines Road
(lh123:Location{number:123,name:'Vet Surgery',street:'Staines Road',local:'Sunbury-on-Thames',postcode:'TW16 5AD'}),
(lh62:Location{number:62,street:'Staines Road',local:'Sunbury-on-Thames',postcode:'TW16 5AD'}),
(lh125:Location{number:125,street:'Staines Road',local:'Sunbury-on-Thames',postcode:'TW16 5AD'})

WITH j1m3,j1x1,j1e2,j1x3,j1e4,j1x5,j1e6,j1x7,j1e8,j1x9,j1e10,j1x11,j1e12,j1x13,j1e14, j2m3,j2x1,j2e2,j2x3,j2e4,j2x5,j2e6,j2x7,j2e8, j11m25,j11x1,j11e2,j11x3,j11e4,j11x5,j11e6,j11x7,j11e8, j12m25,  j_hfr,j_hfrx1,j_hfre2,j_hfrx3,j_hfre4,j_hfrx5,j_hfre6,j_hfrx7,j_hfre8,j_hfrx9,j_hfre10,lh50,lh49,lh48,lh123,lh62,lh125

CREATE UNIQUE
//m3 j1
(j1x1)-[:PART_OF]->(j1m3),
(j1e2)-[:PART_OF]->(j1m3),
(j1x3)-[:PART_OF]->(j1m3),
(j1e4)-[:PART_OF]->(j1m3),
(j1x5)-[:PART_OF]->(j1m3),
(j1e6)-[:PART_OF]->(j1m3),
(j1x7)-[:PART_OF]->(j1m3),
(j1e8)-[:PART_OF]->(j1m3),
(j1x9)-[:PART_OF]->(j1m3),
(j1e10)-[:PART_OF]->(j1m3),
(j1x11)-[:PART_OF]->(j1m3),
(j1e12)-[:PART_OF]->(j1m3),
(j1x13)-[:PART_OF]->(j1m3),
(j1e14)-[:PART_OF]->(j1m3),

// connect j1nodes
(j1e2)-[:ROAD{km:0.461,type:'S',speed:50,peak:30}]->(j1x3),
(j1e2)-[:ROAD{km:0.499,type:'S',speed:50,peak:30}]->(j1x5),
(j1e2)-[:ROAD{km:0.538,type:'S',speed:50,peak:30}]->(j1x7),
(j1e2)-[:ROAD{km:0.1005,type:'S',speed:50,peak:30}]->(j1x9),
(j1e2)-[:ROAD{km:0.643,type:'S',speed:50,peak:30}]->(j1x11),
(j1e2)-[:ROAD{km:0.736,type:'S',speed:50,peak:30}]->(j1x13),

(j1e4)-[:ROAD{km:0.038,type:'S',speed:50,peak:30}]->(j1x5),
(j1e4)-[:ROAD{km:0.077,type:'S',speed:50,peak:30}]->(j1x7),
(j1e4)-[:ROAD{km:0.576,type:'S',speed:50,peak:30}]->(j1x9),
(j1e4)-[:ROAD{km:0.182,type:'S',speed:50,peak:30}]->(j1x11),
(j1e4)-[:ROAD{km:0.275,type:'S',speed:50,peak:30}]->(j1x13),
(j1e4)-[:ROAD{km:0.763,type:'S',speed:50,peak:30}]->(j1x1),

(j1e6)-[:ROAD{km:0.039,type:'S',speed:50,peak:30}]->(j1x7),
(j1e6)-[:ROAD{km:0.538,type:'S',speed:50,peak:30}]->(j1x9),
(j1e6)-[:ROAD{km:0.144,type:'S',speed:50,peak:30}]->(j1x11),
(j1e6)-[:ROAD{km:0.237,type:'S',speed:50,peak:30}]->(j1x13),
(j1e6)-[:ROAD{km:0.725,type:'S',speed:50,peak:30}]->(j1x1),
(j1e6)-[:ROAD{km:0.355,type:'S',speed:50,peak:30}]->(j1x3),

(j1e8)-[:ROAD{km:0.499,type:'S',speed:50,peak:30}]->(j1x9),
(j1e8)-[:ROAD{km:0.105,type:'S',speed:50,peak:30}]->(j1x11),
(j1e8)-[:ROAD{km:0.198,type:'S',speed:50,peak:30}]->(j1x13),
(j1e8)-[:ROAD{km:0.686,type:'S',speed:50,peak:30}]->(j1x1),
(j1e8)-[:ROAD{km:0.316,type:'S',speed:50,peak:30}]->(j1x3),
(j1e8)-[:ROAD{km:0.354,type:'S',speed:50,peak:30}]->(j1x5),

(j1e10)-[:ROAD{km:0.440,type:'S',speed:50,peak:30}]->(j1x11),
(j1e10)-[:ROAD{km:0.533,type:'S',speed:50,peak:30}]->(j1x13),
(j1e10)-[:ROAD{km:0.982,type:'S',speed:50,peak:30}]->(j1x1),
(j1e10)-[:ROAD{km:0.651,type:'S',speed:50,peak:30}]->(j1x3),
(j1e10)-[:ROAD{km:0.689,type:'S',speed:50,peak:30}]->(j1x5),
(j1e10)-[:ROAD{km:0.728,type:'S',speed:50,peak:30}]->(j1x7),

(j1e12)-[:ROAD{km:0.72,type:'S',speed:50,peak:30}]->(j1x13),
(j1e12)-[:ROAD{km:0.560,type:'S',speed:50,peak:30}]->(j1x1),
(j1e12)-[:ROAD{km:0.190,type:'S',speed:50,peak:30}]->(j1x3),
(j1e12)-[:ROAD{km:0.228,type:'S',speed:50,peak:30}]->(j1x5),
(j1e12)-[:ROAD{km:0.267,type:'S',speed:50,peak:30}]->(j1x7),
(j1e12)-[:ROAD{km:0.766,type:'S',speed:50,peak:30}]->(j1x9),

(j1e14)-[:ROAD{km:0.488,type:'S',speed:50,peak:30}]->(j1x1),
(j1e14)-[:ROAD{km:0.118,type:'S',speed:50,peak:30}]->(j1x3),
(j1e14)-[:ROAD{km:0.156,type:'S',speed:50,peak:30}]->(j1x5),
(j1e14)-[:ROAD{km:0.195,type:'S',speed:50,peak:30}]->(j1x7),
(j1e14)-[:ROAD{km:0.694,type:'S',speed:50,peak:30}]->(j1x9),
(j1e14)-[:ROAD{km:0.300,type:'S',speed:50,peak:30}]->(j1x11),

//connect j1m3 to j2m3
(j1x9)-[:ROAD{km:8.459,direction:'south',type:'M',name:'M3',speed:70,peak:55,delay:10}]->(j2e2),
(j2x1)-[:ROAD{km:8.167,direction:'north',type:'M',name:'M3',speed:70,peak:55,delay:10}]->(j1e10),

//m3 j2
(j2x1)-[:PART_OF]->(j2m3),
(j2e2)-[:PART_OF]->(j2m3),
(j2x3)-[:PART_OF]->(j2m3),
(j2e4)-[:PART_OF]->(j2m3),
(j2x5)-[:PART_OF]->(j2m3),
(j2e6)-[:PART_OF]->(j2m3),
(j2x7)-[:PART_OF]->(j2m3),
(j2e8)-[:PART_OF]->(j2m3),

// connect j2/12 nodes
(j2e2)-[:ROAD{km:0.933,type:'S',speed:70,peak:40}]->(j2x3),
(j2e2)-[:ROAD{km:1.309,type:'S',speed:70,peak:40}]->(j2x5),
(j2e2)-[:ROAD{km:1.522,type:'S',speed:70,peak:40}]->(j2x7),
(j2e4)-[:ROAD{km:1.728,type:'S',speed:70,peak:40}]->(j2x5),
(j2e4)-[:ROAD{km:1.832,type:'S',speed:70,peak:40}]->(j2x7),
(j2e4)-[:ROAD{km:2.415,type:'S',speed:70,peak:40}]->(j2x1),
(j2e6)-[:ROAD{km:1.235,type:'S',speed:70,peak:40}]->(j2x7),
(j2e6)-[:ROAD{km:1.683,type:'S',speed:70,peak:40}]->(j2x1),
(j2e6)-[:ROAD{km:1.807,type:'S',speed:70,peak:40}]->(j2x3),
(j2e8)-[:ROAD{km:1.772,type:'S',speed:70,peak:40}]->(j2x1),
(j2e8)-[:ROAD{km:1.769,type:'S',speed:70,peak:40}]->(j2x3),
(j2e8)-[:ROAD{km:2.266,type:'S',speed:70,peak:40}]->(j2x5),

//m25 j11
(j11x1)-[:PART_OF]->(j11m25),
(j11e2)-[:PART_OF]->(j11m25),
(j11x3)-[:PART_OF]->(j11m25),
(j11e4)-[:PART_OF]->(j11m25),
(j11x5)-[:PART_OF]->(j11m25),
(j11e6)-[:PART_OF]->(j11m25),
(j11x7)-[:PART_OF]->(j11m25),
(j11e8)-[:PART_OF]->(j11m25),

// connect j11 nodes
(j11e2)-[:ROAD{km:0.990,type:'S',speed:60,peak:40}]->(j11x3),
(j11e2)-[:ROAD{km:1.336,type:'S',speed:70,peak:50}]->(j11x5),
(j11e2)-[:ROAD{km:1.205,type:'S',speed:50,peak:40}]->(j11x7),
(j11e4)-[:ROAD{km:0.377,type:'S',speed:60,peak:40}]->(j11x5),
(j11e4)-[:ROAD{km:0.235,type:'S',speed:50,peak:40}]->(j11x7),
(j11e4)-[:ROAD{km:0.760,type:'S',speed:50,peak:40}]->(j11x1),
(j11e6)-[:ROAD{km:0.926,type:'S',speed:60,peak:40}]->(j11x7),
(j11e6)-[:ROAD{km:1.457,type:'S',speed:70,peak:50}]->(j11x1),
(j11e6)-[:ROAD{km:1.174,type:'S',speed:50,peak:40}]->(j11x3),
(j11e8)-[:ROAD{km:0.567,type:'S',speed:60,peak:40}]->(j11x1),
(j11e8)-[:ROAD{km:0.274,type:'S',speed:50,peak:40}]->(j11x3),
(j11e8)-[:ROAD{km:0.619,type:'S',speed:50,peak:40}]->(j11x5),

//connect j11m25 to j12m25/j2m3
(j2x3)-[:ROAD{km:1.930,direction:'anti-clockwise',type:'M',name:'M25',speed:70,peak:55}]->(j11e2),
(j11x1)-[:ROAD{km:1.811,direction:'clockwise',type:'M',name:'M25',speed:70,peak:55}]->(j2e4),

//m25 j12 - attach j2 exits and entrances to j12
(j2x1)-[:PART_OF]->(j12m25),
(j2e2)-[:PART_OF]->(j12m25),
(j2x3)-[:PART_OF]->(j12m25),
(j2e4)-[:PART_OF]->(j12m25),
(j2x5)-[:PART_OF]->(j12m25),
(j2e6)-[:PART_OF]->(j12m25),
(j2x7)-[:PART_OF]->(j12m25),
(j2e8)-[:PART_OF]->(j12m25),

//hatch farm
(j_hfrx1)-[:PART_OF]->(j_hfr),
(j_hfre2)-[:PART_OF]->(j_hfr),
(j_hfrx3)-[:PART_OF]->(j_hfr),
(j_hfre4)-[:PART_OF]->(j_hfr),
(j_hfrx5)-[:PART_OF]->(j_hfr),
(j_hfre6)-[:PART_OF]->(j_hfr),
(j_hfrx7)-[:PART_OF]->(j_hfr),
(j_hfre8)-[:PART_OF]->(j_hfr),
(j_hfrx9)-[:PART_OF]->(j_hfr),
(j_hfre10)-[:PART_OF]->(j_hfr),

// connect hatch farm
(j_hfre2)-[:ROAD{km:0.032,type:'S',speed:50,peak:40}]->(j_hfrx3),
(j_hfre2)-[:ROAD{km:0.063,type:'S',speed:50,peak:40}]->(j_hfrx5),
(j_hfre2)-[:ROAD{km:0.133,type:'S',speed:50,peak:40}]->(j_hfrx7),
(j_hfre2)-[:ROAD{km:0.167,type:'S',speed:50,peak:40}]->(j_hfrx9),

(j_hfre4)-[:ROAD{km:0.031,type:'S',speed:50,peak:40}]->(j_hfrx5),
(j_hfre4)-[:ROAD{km:0.101,type:'S',speed:50,peak:40}]->(j_hfrx7),
(j_hfre4)-[:ROAD{km:0.135,type:'S',speed:50,peak:40}]->(j_hfrx9),
(j_hfre4)-[:ROAD{km:0.183,type:'S',speed:50,peak:40}]->(j_hfrx1),

(j_hfre6)-[:ROAD{km:0.070,type:'S',speed:50,peak:40}]->(j_hfrx7),
(j_hfre6)-[:ROAD{km:0.104,type:'S',speed:50,peak:40}]->(j_hfrx9),
(j_hfre6)-[:ROAD{km:0.152,type:'S',speed:50,peak:40}]->(j_hfrx1),
(j_hfre6)-[:ROAD{km:0.199,type:'S',speed:50,peak:40}]->(j_hfrx3),

(j_hfre8)-[:ROAD{km:0.034,type:'S',speed:50,peak:40}]->(j_hfrx1),
(j_hfre8)-[:ROAD{km:0.082,type:'S',speed:50,peak:40}]->(j_hfrx3),
(j_hfre8)-[:ROAD{km:0.129,type:'S',speed:50,peak:40}]->(j_hfrx5),
(j_hfre8)-[:ROAD{km:0.160,type:'S',speed:50,peak:40}]->(j_hfrx9),

(j_hfre10)-[:ROAD{km:0.078,type:'S',speed:50,peak:40}]->(j_hfrx1),
(j_hfre10)-[:ROAD{km:0.082,type:'S',speed:50,peak:40}]->(j_hfrx3),
(j_hfre10)-[:ROAD{km:0.113,type:'S',speed:50,peak:40}]->(j_hfrx5),
(j_hfre10)-[:ROAD{km:0.183,type:'S',speed:50,peak:40}]->(j_hfrx7),

//connect hatch farm to m2 j11
(j_hfrx9)-[:ROAD{km:1.224,type:'A',name:'A317',speed:70,peak:60,delay:15}]->(j11e4),
(j11x3)-[:ROAD{km:1.101,type:'A',name:'A317',speed:70,peak:60,delay:15}]->(j_hfre10),

//connect hatch farm to Addlestone Moor
(j_hfrx1)-[:ROAD{km:0.117,type:'C',name:'Addlestone Moor',speed:30,peak:30}]->(lh50),
(lh50)-[:ROAD{km:0.008,type:'C',name:'Addlestone Moor',speed:30,peak:30}]->(lh49),
(lh49)-[:ROAD{km:0.008,type:'C',name:'Addlestone Moor',speed:30,peak:30}]->(lh48),
(j_hfre2)<-[:ROAD{km:0.117,type:'C',name:'Addlestone Moor',speed:30,peak:30}]-(lh50),
(lh50)<-[:ROAD{km:0.008,type:'C',name:'Addlestone Moor',speed:30,peak:30}]-(lh49),
(lh49)<-[:ROAD{km:0.008,type:'C',name:'Addlestone Moor',speed:30,peak:30}]-(lh48),

//connect m3 j1 to Staines Road
(j1x3)-[:ROAD{km:0.503,type:'A',name:'Staines Road',speed:30,peak:20}]->(lh123),
(lh123)-[:ROAD{km:0.008,type:'A',name:'Staines Road',speed:30,peak:20}]->(lh62),
(lh62)-[:ROAD{km:0.008,type:'A',name:'Staines Road',speed:30,peak:20}]->(lh125),
(j1e4)<-[:ROAD{km:0.117,type:'A',name:'Staines Road',speed:30,peak:20}]-(lh123),
(lh123)<-[:ROAD{km:0.008,type:'A',name:'Staines Road',speed:30,peak:20}]-(lh62),
(lh62)<-[:ROAD{km:0.008,type:'A',name:'Staines Road',speed:30,peak:20}]-(lh125)