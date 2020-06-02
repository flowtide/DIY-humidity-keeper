<template>
<div  style="box-shadow: 0px 3px #009800;">
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="/">
    습도 관리 시스템
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/rules">규칙</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em><b-icon icon="gear-fill" aria-hidden="true"></b-icon></em>
          </template>
          <b-dropdown-item to="/login" v-if="!isAuthenticated()"><b-icon icon="person" aria-hidden="true"></b-icon>로그인</b-dropdown-item>
          <b-dropdown-item to="/user-edit" replace v-if="isAuthenticated()"><b-icon icon="power" aria-hidden="true"></b-icon>사용자정보</b-dropdown-item>
          <b-dropdown-item to="/logout" replace v-if="isAuthenticated()"><b-icon icon="power" aria-hidden="true"></b-icon>로그아웃</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "NavigationBar",
  methods: {
    ...mapGetters(["isAuthenticated"])
  },
  computed: {
  }
}
</script>
