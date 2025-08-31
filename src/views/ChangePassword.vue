<template>
  <div class="login_wrap">
    <div class="login_border">
      <div class="login" style="width: 400px; margin: 40px auto">
        <h2 style="text-align: center; color: #00bcd4; margin-bottom: 30px">
          修改密码
        </h2>
        <form @submit.prevent="handleClick">
          <input
            type="hidden"
            name="execution"
            th:value="${flowExecutionKey}"
          />
          <input type="hidden" name="_eventId" value="submit" />

          <dl>
            <dd>
              <input
                name="username"
                type="text"
                class="txtUser"
                id="username"
                placeholder="请输入用户名"
                v-model="username"
              />
            </dd>
          </dl>
          <dl>
            <dd>
              <input
                name="oldPassword"
                type="password"
                class="Userpwd"
                id="oldPassword"
                placeholder="请输入旧密码"
                v-model="oldPassword"
              />
            </dd>
          </dl>
          <dl>
            <dd>
              <input
                name="newPassword"
                type="password"
                class="Userpwd"
                id="newPassword"
                placeholder="请输入新密码"
                v-model="newPassword"
              />
            </dd>
          </dl>
          <dl>
            <dd>
              <input
                name="confirmPassword"
                type="password"
                class="Userpwd"
                id="confirmPassword"
                placeholder="请确认新密码"
                v-model="confirmPassword"
              />
            </dd>
          </dl>

          <div class="tishi" v-if="errorMessage">{{ errorMessage }}</div>

          <button
            type="submit"
            id="logbtn"
            style="outline: none; width: 100%; padding: 12px"
          >
            提交修改
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { changePassword } from "@/api/authManage";
const router = useRouter();
const username = ref("");
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

const handleClick = async () => {
  if (
    !username.value ||
    !oldPassword.value ||
    !newPassword.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = "所有字段都必须填写";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "两次输入的新密码不一致";
    return;
  }

  try {
    const result = await changePassword(
      username.value,
      oldPassword.value,
      newPassword.value
    );
    if (result && result.success) {
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      router.push("/dashboard");
    } else {
      errorMessage.value = result?.error || "用户名或密码错误！";
    }
  } catch (error) {
    errorMessage.value = "用户名或密码错误！";
  }

  // 提交成功
  errorMessage.value = "";
  alert("密码修改成功");
  router.push("/dashboard");
};
</script>

<style scoped>
@import "../assets/styles/login/base.css";
@import "../assets/styles/login/cas.css";
@import "../assets/styles/login/style.css";
.login_wrap {
  background: #000d20 url(img/login/login_bg.jpg) no-repeat center top;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_border {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  margin: auto;
}
.login {
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
input[type="password"] {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
}
button {
  background-color: #00bcd4;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 42px;
}
button:hover {
  background-color: #0097a7;
}
.tishi {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}
</style>
