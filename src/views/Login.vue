<template>
  <div>
    <header role="banner" class="sso-header" style="background-color: #ffffff">
      <div class="wrapper" id="login_head">
        <div class="log_head">
          <div class="log_logo left">
            <a href="javascript:;"
              ><span style="font-size: 46px"
                >网络安全日志分析</span
              ></a
            >
          </div>
        </div>
      </div>
    </header>

    <main role="main" class="sso-content">
      <div
        class="login_wrap"
        style="
          background: #000d20 url(img/login/login_bg.jpg) no-repeat center top;
        "
      >
        <div class="wrapper" id="login_body" style="width: ">
          <div class="login_border" style="padding: 8px">
            <div class="login" v-show="!showApp">
              <div style="position: absolute; right: 30px; top: 24px"></div>

              <div class="login-body">
                <!-- 添加“系统登录”文本 -->
                <div class="login-title">
                  <h2>系统登录</h2>
                </div>

                <!-- 账号密码登录 -->
                <div class="login-style" style="display: block">
                  <form id="usernameForm" method="post" action="login">
                    <input type="hidden" name="loginType" value="username" />
                    <input
                      type="hidden"
                      name="execution"
                      th:value="${flowExecutionKey}"
                    />
                    <input type="hidden" name="_eventId" value="submit" />
                    <input type="hidden" name="geolocation" />
                    <dl>
                      <dd>
                        <input
                          name="username"
                          type="text"
                          class="txtUser"
                          id="txtUser"
                          placeholder="请输入您的用户名"
                          th:value="${param.username == null? '': param.username}"
                          onkeydown="if(event.keyCode===13){userLogin();}"
                        />
                      </dd>
                    </dl>
                    <dl>
                      <dd>
                        <input
                          name="password"
                          type="password"
                          value=""
                          class="Userpwd"
                          id="Userpwd"
                          placeholder="请输入您的密码"
                          onkeydown="if(event.keyCode===13){userLogin();}"
                        />
                      </dd>
                    </dl>
                    <div class="tishi"></div>
                    <button
                      @click="userLogin"
                      type="button"
                      id="logbtn"
                      style="outline: none"
                    >
                      登 录
                    </button>
                    <button
                      @click="$router.push('/change-password')"
                      type="button"
                      id="logbtn"
                      style="outline: none"
                    >
                      修改密码
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer" role="contentinfo">
      <div class="wrapper">
        <div class="copy">
          <p style="font-size: 14px">
            &nbsp;&nbsp;&nbsp;&nbsp; 技术支持：山西信元达科技有限公司
            &nbsp;&nbsp;&nbsp;&nbsp;
          </p>
          <p style="font-size: 14px">
            地址：山西省太原市迎泽区桥东街道东岗路201号8号楼三单元502室&nbsp;&nbsp;&nbsp;&nbsp;邮编:030000
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { login } from "@/api/authManage";
export default {
  name: "login",
  data() {
    return {
      showUsername: true,
      showPhone: false,
      showCa: false,
      showApp: false,
    };
  },
  mounted() {
    const usernameInput = document.getElementById("txtUser");
    const passwordInput = document.getElementById("Userpwd");
    const loginButton = document.getElementById("logbtn");

    // 检查所有可能的锁定记录
    let lockedUsername = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("lockout_time_")) {
        const username = key.replace("lockout_time_", "");
        const lockoutTimeStr = localStorage.getItem(key);
        if (lockoutTimeStr) {
          const lockoutTime = parseInt(lockoutTimeStr, 10);
          let remaining = lockoutTime - Date.now();
          if (remaining > 0) {
            lockedUsername = username;
            this.startCountdown(lockedUsername, remaining);
            break;
          } else {
            // 清除过期的锁定
            localStorage.removeItem(key);
            localStorage.removeItem(`login_attempts_${username}`);
          }
        }
      }
    }

    if (lockedUsername) {
      // 设置输入框为锁定用户名
      if (usernameInput) {
        usernameInput.value = lockedUsername;
        usernameInput.disabled = true;
      }
      if (passwordInput) passwordInput.disabled = true;
      if (loginButton) loginButton.disabled = true;
      this.checkLockoutStatus(lockedUsername);
    }

    if (usernameInput) {
      const username = usernameInput.value.trim();
      if (username) {
        console.log("🚀 ~ username:", username);
        this.checkLockoutStatus(username);
      }
      // usernameInput.addEventListener("input", (e) => {
      //   const newUsername = e.target.value.trim();
      //   if (newUsername) {
      //     this.checkLockoutStatus(newUsername);
      //   }
      // });
    }
  },
  methods: {
    /**
     * 处理用户登录请求
     * 1. 验证输入有效性
     * 2. 检查账户锁定状态
     * 3. 调用API进行身份验证
     * 4. 处理成功/失败响应
     */
    async userLogin() {
      const usernameInput = document.getElementById("txtUser");
      const passwordInput = document.getElementById("Userpwd");
      const errorDiv = document.querySelector(".tishi");

      if (!usernameInput || !passwordInput || !errorDiv) return;

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // 清空之前的错误提示
      errorDiv.textContent = "";

      // 验证输入有效性
      if (!username) {
        errorDiv.textContent = "请输入用户名";
        errorDiv.style.color = "red";
        return;
      }

      if (!password) {
        errorDiv.textContent = "请输入密码";
        errorDiv.style.color = "red";
        return;
      }

      // 检查账户锁定状态
      this.checkLockoutStatus(username);
      const lockoutTimeStr = localStorage.getItem(`lockout_time_${username}`);
      if (lockoutTimeStr && parseInt(lockoutTimeStr, 10) > Date.now()) {
        return; // 仍处于锁定状态，不进行登录尝试
      }

      try {
        // 调用登录API
        const response = await login(username, password);

        if (response.success) {
          // 清除登录尝试记录
          localStorage.removeItem(`login_attempts_${username}`);
          localStorage.removeItem(`lockout_time_${username}`);

          // 存储token
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
		  this.checkLockoutStatus(username) 
          // 跳转到dashboard
          this.$router.push("/dashboard");
        } else {
          // 处理登录失败
          this.handleLoginFailure(username);
        }
      } catch (error) {
        this.handleLoginFailure(username);
        console.error("Login error:", error);
      }
    },

    /**
     * 处理登录失败逻辑
     * @param {string} username - 当前尝试登录的用户名
     */
    handleLoginFailure(username) {
      const errorDiv = document.querySelector(".tishi");
      const maxAttempts = 5;

      // 获取当前尝试次数
      let attempts = parseInt(
        localStorage.getItem(`login_attempts_${username}`) || "0",
        10
      );
      attempts = isNaN(attempts) ? 0 : attempts;

      // 更新尝试次数
      attempts++;
      localStorage.setItem(`login_attempts_${username}`, attempts.toString());

      if (attempts >= maxAttempts) {
        // 达到最大尝试次数，锁定账户30分钟
        const lockoutTime = Date.now() + 30 * 60 * 1000;
        localStorage.setItem(
          `lockout_time_${username}`,
          lockoutTime.toString()
        );
        this.startCountdown(username, 30 * 60 * 1000);
      } else {
        // 更新错误提示
        const remainingAttempts = maxAttempts - attempts;
        if (errorDiv) {
          errorDiv.style.color = "red";
          errorDiv.textContent = `密码错误，密码由8位以上数字、大小写字母与特殊字符组成，还剩${remainingAttempts}次机会`;
        }
      }
    },

    /**
     * 检查用户锁定状态并更新UI
     * @param {string} username - 需要检查的用户名
     */
    checkLockoutStatus(username) {
      const lockoutTimeStr = localStorage.getItem(`lockout_time_${username}`);
      const errorDiv = document.querySelector(".tishi");

      if (lockoutTimeStr) {
        const lockoutTime = parseInt(lockoutTimeStr, 10);
        const remaining = lockoutTime - Date.now();

        if (remaining > 0) {
          // 有效锁定状态，启动倒计时
          this.startCountdown(username, remaining);
          return;
        } else {
          // 清除过期的锁定记录
          localStorage.removeItem(`lockout_time_${username}`);
          localStorage.removeItem(`login_attempts_${username}`);
        }
      }

      // 检查登录尝试次数
      const attemptsStr = localStorage.getItem(`login_attempts_${username}`);
      let attempts = 0;
      if (attemptsStr !== null) {
        attempts = parseInt(attemptsStr, 10);
        if (isNaN(attempts)) attempts = 0;
      }

      const maxAttempts = 5;
      if (attempts > 0 && attempts < maxAttempts) {
        const remainingAttempts = maxAttempts - attempts;
        if (errorDiv) {
          errorDiv.style.color = "red";
          errorDiv.textContent = `密码错误，密码由8位以上数字、大小写字母与特殊字符组成，还剩${remainingAttempts}次机会`;
        }
      } else if (errorDiv) {
        errorDiv.textContent = "";
      }
    },

    startCountdown(username, duration) {
      const errorDiv = document.querySelector(".tishi");
      const usernameInput = document.getElementById("txtUser");
      const passwordInput = document.getElementById("Userpwd");
      const loginButton = document.getElementById("logbtn");

      // 确保输入框被禁用
      if (usernameInput) usernameInput.disabled = true;
      if (passwordInput) passwordInput.disabled = true;
      if (loginButton) loginButton.disabled = true;

      let remaining = duration;
      // 立即显示初始提示（解决刷新后立即显示问题）
      const lockoutDuration = Math.ceil(remaining / 1000);
      const minutes = Math.floor(lockoutDuration / 60);
      const seconds = lockoutDuration % 60;
      const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      if (errorDiv) {
        errorDiv.style.color = "red";
        errorDiv.textContent = `账户已锁定，请${formattedTime}后重试`;
      }

      const interval = setInterval(() => {
        remaining -= 1000;
        if (remaining <= 0) {
          clearInterval(interval);
          this.clearLockout(username);
        } else {
          const lockoutDuration = Math.ceil(remaining / 1000);
          const minutes = Math.floor(lockoutDuration / 60);
          const seconds = lockoutDuration % 60;
          const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
            seconds
          ).padStart(2, "0")}`;
          if (errorDiv) {
            errorDiv.style.color = "red";
            errorDiv.textContent = `账户已锁定，请${formattedTime}后重试`;
          }
        }
      }, 1000);
    },
  },
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
  color: #3583cc;
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

/* 为禁用状态的输入框添加灰色背景 */
.txtUser:disabled,
.Userpwd:disabled {
  background-color: #f0f0f0 !important;
  cursor: not-allowed;
}
</style>
