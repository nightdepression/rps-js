class RPS {
    constructor() {
        this.board = {
            scoreP: document.querySelector('.board .player span'),
            scoreC: document.querySelector('.board .computer span'),
            choiceP: document.querySelector('.board .player div'),
            choiceC: document.querySelector('.board .computer div'),
            status: document.querySelector('.status'),
            controls: document.querySelector('.controls')
        }
    }

    get game() {
        return this._game;
    }

    set game(data) {
        this._game = ({ ...this.game, ...data });
        this.redraw();
    }

    getDefaultData() {
        return {
            scoreP: 0,
            scoreC: 0,
            choiceP: null,
            choiceC: null,
            roundCurr: 0,
            roundTotal: 5,
            status: 'Матч скоро начнется!'
        }
    }

    getRandomChoice() {
        return ['rock', 'paper', 'scissors'][Math.floor((Math.random() * 3))];
    }

    getRoundOutCome({ choiceP, choiceC }) {
        switch (choiceP) {
            case 'rock': return choiceC === 'scissors' ? { p: 1, c: 0 } : choiceC === 'paper' ? { p: 0, c: 1 } : { p: 0, c: 0 };
            case 'paper': return choiceC === 'rock' ? { p: 1, c: 0 } : choiceC === 'scissors' ? { p: 0, c: 1 } : { p: 0, c: 0 };
            case 'scissors': return choiceC === 'paper' ? { p: 1, c: 0 } : choiceC === 'rock' ? { p: 0, c: 1 } : { p: 0, c: 0 };
        }
    }

    getRoundStatus({ scoreP, scoreC, round }) {
        if (round.roundCurr === this.game.roundTotal) {
            return round.scoreP > round.scoreC
                ? `Матч окончен, игрок выиграл ${this.game.scoreP}-${this.game.scoreC}!`
                : round.scoreP < round.scoreC
                    ? `Матч окончен, компьютер выиграл ${this.game.scoreP}-${this.game.scoreC}!`
                    : `Матч закончился ничьей ${this.game.scoreP}-${this.game.scoreC}.`
        }

        return scoreP > scoreC
            ? `Раунд ${round.roundCurr} закончен, игрок выиграл`
            : scoreP < scoreC
                ? `Раунд ${round.roundCurr} закончен, компьютер выиграл`
                : `Раунд ${round.roundCurr} закончился ничьей`
    }

    setRound({ choiceP, choiceC }) {
        const { p: scoreP, c: scoreC } = this.getRoundOutCome({ choiceP, choiceC });
        const round = ({
            ...this.game,
            scoreP: this.game.scoreP + scoreP,
            scoreC: this.game.scoreC + scoreC,
            choiceP: choiceP,
            choiceC: choiceC,
            roundCurr: this.game.roundCurr + 1
        });

        this.game = ({ ...round, status: this.getRoundStatus({ scoreP, scoreC, round }) });

    }

    reflow() {
        for (const animation of document.getAnimations()) {
            animation.cancel();
            animation.play();
        }
    }

    redraw() {
        this.board.scoreP.textContent = `Игрок: ${this.game.scoreP}`;
        this.board.scoreC.textContent = `Компьютер: ${this.game.scoreC}`;
        this.board.choiceP.dataset.icon = this.game.choiceP;
        this.board.choiceC.dataset.icon = this.game.choiceC;
        this.board.status.textContent = this.game.status;

        this.reflow();

        this.board.controls.dataset.playing = this.game.roundCurr < this.game.roundTotal;
    }


    addEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.controls li')) {
                const icon = e.target.dataset.icon
                    ? e.target.dataset.icon
                    : e.target.querySelector('.icon').dataset.icon

                icon === 'restart'
                    ? this.game = this.getDefaultData()
                    : this.setRound({
                        choiceP: icon,
                        choiceC: this.getRandomChoice()
                    })
            }
        });
    }

    init() {
        this.addEventListeners();
        this.game = this.getDefaultData();
    }

}

new RPS().init();