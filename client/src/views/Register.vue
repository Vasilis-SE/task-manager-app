<template>
  	<v-app id="inspire">
  		<v-content>
    		<v-container class="fill-height" fluid>
    			<v-row align="center" justify="center">
    				<v-col cols="12" sm="8" md="4">
    					<v-card dark>
							<v-toolbar color="primary" flat>
								<v-toolbar-title> Sign Up Form </v-toolbar-title>
								<v-spacer />
							</v-toolbar>
							<v-card-text>
								<v-form>
                 					<v-text-field id="username" label="Username" name="username" :prepend-icon="user_icon" type="email" />
                 					<v-text-field id="email" label="Email" name="email" :prepend-icon="user_icon" type="text" />
                  					<v-text-field id="password" label="Password" name="password" :prepend-icon="lock_icon" type="password" />
                  					<v-text-field id="rePassword" label="Repeat Password" name="rePassword" :prepend-icon="lock_icon" type="password" />
								</v-form>
							</v-card-text>
							<v-card-actions>
								<v-spacer />
								<v-btn color="normal">Back</v-btn>
								<v-btn color="primary">Sign Up</v-btn>
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