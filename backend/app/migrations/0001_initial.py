# Generated by Django 3.1.5 on 2021-01-21 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Text',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=1000, null=True)),
                ('title', models.CharField(max_length=252, null=True)),
            ],
        ),
    ]
