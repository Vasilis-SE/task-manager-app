<template>
  	<v-app id="inspire">
  		<v-content>
    		<v-container class="fill-height" fluid>
    			<v-row align="center" justify="center">
    				<v-col cols="12" sm="8" md="4">
    					<v-card class="elevation-12">
							<v-toolbar color="primary" dark flat>
								<v-toolbar-title> Login form </v-toolbar-title>
								<v-spacer />
							</v-toolbar>
							<v-card-text>
								<v-form>
                 					<v-text-field id="email" label="Email" name="login" :prepend-icon="user_icon" type="text" placeholder="Type your email here..."/>
                  					<v-text-field id="password" label="Password" name="password" :prepend-icon="lock_icon" type="password" placeholder="Type your password here..."/>
								</v-form>
							</v-card-text>
							<v-card-actions>
								<v-spacer />
								<v-btn color="primary">Login</v-btn>
								<v-btn color="normal">Register</v-btn>
							</v-card-actions>
    					</v-card>
    				</v-col>
    			</v-row>
    		</v-container>
  		</v-content>
  	</v-app>
</template>

<script>
	import { mdiAccount, mdiLock } from '@mdi/js'

	export default {
		data: () => ({
	    	user_icon: mdiAccount,
	    	lock_icon: mdiLock,
	    }),
		props: {
			source: String,
		},
	};
</script>