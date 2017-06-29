"use strict";
cc._RFpush(module, '7b863EfSvpNQLUzEIzJ/h0d', 'Game');
// scripts/Game.js

cc.Class({
    'extends': cc.Component,

    properties: {
        //这个属性引用了星星预制资源
        starPrefab: {
            'default': null,
            type: cc.Prefab
        },
        //星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        //地面节点，用于确定星星生成的高度
        ground: {
            'default': null,
            type: cc.Node
        },
        //player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            'default': null,
            type: cc.Node
        },
        scoreDisplay: {
            'default': null,
            type: cc.Label
        },
        //得分音效资源
        scoreAudio: {
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.groundY = this.ground.y + this.ground.height / 2;

        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        //生成一个新的星星
        this.spawnNewStar();
        //初始化计分
        this.score = 0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    spawnNewStar: function spawnNewStar() {
        //使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        //将新增的节点添加到Canvas节点下面
        this.node.addChild(newStar);
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        //将Game组件的实例传入星星组件
        newStar.getComponent('Star').game = this;

        //重置计时器根据消失时间随机取一个值
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },
    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        //根据地平面位置和主角跳跃高度，随机得到一个星星的y坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        //根据屏幕宽度，随机得到一个星星x坐标
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;

        //返回星星坐标
        return cc.p(randX, randY);
    },
    gainScore: function gainScore() {
        this.score += 1;
        //更新scoreDisplay Label的文字
        this.scoreDisplay.string = "Score : " + this.score.toString();
        //播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    gameOver: function gameOver() {
        this.player.stopAllActions(); //停止player节点的跳跃动作
        cc.director.loadScene("game");
    }
});

cc._RFpop();