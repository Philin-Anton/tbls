'use strict';

 const stoge = {
    stage: {
        users: [],
        currentPage: 0,
        total: 0,
        itemSize: 0
    },
    get stage() {
        this.stage;
    },
    set stage(newStage) {
        this.stage = newStage;
    },
    get users() {
        this.stage.users
    },
    set users(newUsers) {
        this.stage.users = newUsers;
    },
    get currentPage() {
        this.stage.currentPage
    },
    set currentPage(newPage) {
        this.stage.currentPage = newPage;
    },
    get total() {
        this.stage.total
    },
    set total(newTotal) {
        this.stage.total = newTotal;
    },
    get itemSize() {
        this.stage.itemSize
    },
    set itemSize(newItemSize) {
        this.stage.itemSize = newItemSize;
    }
};

export default stoge;