<template>
  <div>
    <header role="banner" class="sso-header" style="background-color: #ffffff;">
      <div class="wrapper" id="login_head">
        <div class="log_head">
          <div class="log_logo left"><a href="javascript:;"><span style="font-size: 46px;">网络安全日志分析与溯源系统</span></a></div>
        </div>
      </div>
    </header>

    <main role="main" class="sso-content">
      <div class="login_wrap" style="background:#000d20 url(img/login/login_bg.jpg) no-repeat center top;">
        <div class="wrapper" id="login_body" style="width:;">
          <div class="login_border" style="padding:8px;">
            <div class="login" v-show="!showApp">
              <div style="position:absolute; right:30px; top:24px;"></div>

              <div class="login-body">
                <!-- 添加“系统登录”文本 -->
                <div class="login-title">
                  <h2>系统登录</h2>
                </div>

                <!-- 账号密码登录 -->
                <div class="login-style" style="display: block;">
                  <form id="usernameForm" method="post" action="login">
                    <input type="hidden" name="loginType" value="username" />
                    <input type="hidden" name="execution" th:value="${flowExecutionKey}" /> 
                    <input type="hidden" name="_eventId" value="submit" />
                    <input type="hidden" name="geolocation" />
                    <dl>
                      <dd><input name="username" type="text" class="txtUser" id="txtUser" placeholder="请输入您的用户名"
                          th:value="${param.username == null? '': param.username}"
                          onkeydown='if(event.keyCode===13){userLogin();}' /> </dd>
                    </dl>
                    <dl>
                      <dd><input name="password" type="password" value="" class="Userpwd" id="Userpwd"
                          placeholder="请输入您的密码" onkeydown='if(event.keyCode===13){userLogin();}' /></dd>
                    </dl>
                    <div class="tishi"></div> 
                    <button @click="userLogin" type="button" id="logbtn" style="outline:none">登 录</button>
                  </form>
                </div>

                <!-- ... 其他代码 ... -->
              </div>
            </div>

            <!-- ... 其他代码 ... -->
          </div>
        </div>
      </div>
    </main>

    <footer class="footer" role="contentinfo">
      <div class="wrapper">
        <div class="copy">
          <p style="font-size: 14px;"> &nbsp;&nbsp;&nbsp;&nbsp; 技术支持：山西信元达科技有限公司 &nbsp;&nbsp;&nbsp;&nbsp; </p>
          <p style="font-size: 14px;">地址：山西省太原市迎泽区桥东街道东岗路201号8号楼三单元502室&nbsp;&nbsp;&nbsp;&nbsp;邮编:030000</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      showUsername: true,
      showPhone: false,
      showCa: false,
      showApp: false
    };
  },
  methods: {
    handleClick(type) {
      if(type === 'username') {
        this.showUsername = true
        this.showPhone = false
        this.showCa = false
      } else if(type === 'phone') {
        this.showPhone = true
        this.showUsername = false
        this.showCa = false
      } else if(type === 'ca') {
        this.showCa = true
        this.showUsername = false
        this.showPhone = false
      } else {
        this.showApp = !type
      }
    },
    userLogin() {
        const usernameInput = document.getElementById('txtUser').value.trim();
        const passwordInput = document.getElementById('Userpwd').value.trim();

        // 获取提示框元素
        const errorDiv = document.querySelector('.tishi');

        if (errorDiv) {
            errorDiv.textContent = ''; // 清空旧提示
        }

        // 判断是否为空
        if (!usernameInput || !passwordInput) {
            if (errorDiv) {
            errorDiv.style.color = '#ff9900'; // 警告颜色
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = '用户名或密码不能为空！';
            } else {
            alert('用户名或密码不能为空！');
            }
            return; // 阻止后续执行
        }

        // 写死的用户名和密码
        const validUsername = 'admin';
        const validPassword = 'Admin123456@';

        // 校验用户名和密码
        if (usernameInput === validUsername && passwordInput === validPassword) {
            this.$router.push('/dashboard'); // 成功跳转
        } else {
            if (errorDiv) {
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = '用户名或密码错误！';
            } else {
            alert('用户名或密码错误！');
            }
        }
    }
  }
};
</script>

<style scoped>
  @import "../assets/styles/login/base.css";
  @import "../assets/styles/login/cas.css";
  @import "../assets/styles/login/style.css";

  .login-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .login-title {
    text-align: center;
    margin: 30px auto 0px;
  }

  .login-title h2 {
    font-size: 24px;
    color: #3583CC;
  }

  .login-style {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .login-style form {
    width: 100%;
  }

  .login-style dl {
    margin-bottom: 15px;
  }
</style>