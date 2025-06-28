<script>
    import { enhance } from '$app/forms';
</script>

<form method="POST" action="/settings/auth?/logout" use:enhance>
    <button type="submit">退出登陆</button>
</form>
