// write code to import all models from models folder
const userModel = require('../models/userModel');
const distanceAdditionalPriceModel = require('../models/distanceAdditionalPriceModel');
const distanceBasePriceModel = require('../models/distanceBasePriceModel');
const pricingConfigurationModel = require('../models/pricingConfigurationModel');
const timeMultiplierFactorModel = require('../models/timeMultiplierFactorModel');
const waitingChargesModel = require('../models/waitingChargesModel');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');


module.exports = {
  createConfig: async (req, res) => {
    try {
      const { pricingConfig, distanceBasePrice, timeMultiplierFactor, waitingCharges } = req.body;
      if (
        pricingConfig === undefined ||
        waitingCharges === undefined ||
        !distanceBasePrice.length ||
        // !distanceAdditionalPrice.length ||
        !timeMultiplierFactor.length
      ) return res.status(400).send({ status: false, message: "Please add all fields" });


      const { name, description, enabled, start_date, end_date } = pricingConfig;
      const newPricingConfig = await new pricingConfigurationModel({
        name,
        description,
        enabled,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        created_by: req.user._id,
        updated_by: req.user._id
      }).save();
      if (newPricingConfig) {
        // const
        await Promise.all(distanceBasePrice.map(async (item) => {
          const newDistanceBasePrice = await new distanceBasePriceModel({
            config_id: newPricingConfig._id,
            day_of_week: item.day_of_week,
            max_distance: item.max_distance,
            additional_price_per_km: item.additional_price_per_km,
            price: item.price,
            created_by: req.user._id,
            updated_by: req.user._id
          }).save();
        }))

        // await Promise.all(distanceAdditionalPrice.map(async (item) => {
        //   const newDistanceAdditionalPrice = await new distanceAdditionalPriceModel({
        //     config_id: newPricingConfig._id,
        //     max_distance: item.max_distance,
        //     price_per_km: item.price_per_km,
        //     created_by: req.user._id,
        //     updated_by: req.user._id
        //   }).save();
        // }))

        await Promise.all(timeMultiplierFactor.map(async (item) => {
          const newTimeMultiplierFactor = await new timeMultiplierFactorModel({
            config_id: newPricingConfig._id,
            start_time_in_hours: item.start_time_in_hours,
            end_time_in_hours: item.end_time_in_hours,
            multiplier: item.multiplier,
            created_by: req.user._id,
            updated_by: req.user._id
          }).save();
        }))


        const { initial_waiting_time, charge_per_unit_time, time_multiplier, } = waitingCharges;
        const newWaitingCharges = await new waitingChargesModel({
          config_id: newPricingConfig._id,
          initial_waiting_time: initial_waiting_time,
          charge_per_unit_time: charge_per_unit_time,
          time_multiplier: time_multiplier,
          created_by: req.user._id,
          updated_by: req.user._id
        }).save();

        return res.status(200).send({ status: true, message: "Pricing configuration created successfully" })
      }
      return res.status(400).send({ status: false, message: "Something went wrong" })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  getallConfig: async (req, res) => {
    try {
      const data = await pricingConfigurationModel.find({});
      if (data.length) {
        return res.status(200).send({ status: true, message: "Pricing configurations list", data: data })
      }
      return res.status(200).send({ status: false, message: "No data found" })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  // updateDistanceAdditionalPrice: async (req, res) => {
  //   try {
  //     const { _id, max_distance, price_per_km } = req.body;
  //     if (!_id || !max_distance || !price_per_km) return res.status(400).send({ status: false, message: "Please add all fields" });
  //     const data = await distanceAdditionalPriceModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { max_distance, price_per_km, updated_by: req.user._id }, { new: true });
  //     if (data) {
  //       return res.status(200).send({ status: true, message: "Distance additional price updated successfully", data: data })
  //     }
  //     return res.status(200).send({ status: false, message: "No data found" })
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(500).send({ status: false, message: "Something went wrong" })
  //   }
  // },

  updateDistanceBasePrice: async (req, res) => {
    try {
      const { _id, additional_price_per_km, max_distance, price } = req.body;
      if (!_id || !additional_price_per_km || !max_distance || !price) return res.status(400).send({ status: false, message: "Please add all fields" });
      const data = await distanceBasePriceModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { additional_price_per_km, max_distance, price, updated_by: req.user._id }, { new: true });
      if (data) {
        return res.status(200).send({ status: true, message: "Distance base price updated successfully", data: data })
      }
      return res.status(200).send({ status: false, message: "No data found" })

    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  updatePricingConfig: async (req, res) => {
    try {
      const { _id, name, description, enabled, start_date, end_date } = req.body;
      if (!_id || !name || !description || enabled === undefined || !start_date || !end_date) return res.status(400).send({ status: false, message: "Please add all fields" });
      const data = await pricingConfigurationModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { name, description, enabled, start_date: new Date(start_date), end_date: new Date(end_date), updated_by: req.user._id }, { new: true });
      if (data) {
        return res.status(200).send({ status: true, message: "Pricing configuration updated successfully", data: data })
      }
      return res.status(200).send({ status: false, message: "No data found" })

    } catch (error) {
      onsole.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  updateTimeMultiplierFactor: async (req, res) => {
    try {
      const { _id, start_time_in_hours, end_time_in_hours, multiplier } = req.body;
      if (!_id || !start_time_in_hours || !end_time_in_hours || !multiplier) return res.status(400).send({ status: false, message: "Please add all fields" });
      const data = await timeMultiplierFactorModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { start_time_in_hours, end_time_in_hours, multiplier, updated_by: req.user._id }, { new: true });
      if (data) {
        return res.status(200).send({ status: true, message: "Time multiplier factor updated successfully", data: data })
      }
      return res.status(200).send({ status: false, message: "No data found" })
    } catch (error) {
      onsole.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  updateWaitingCharges: async (req, res) => {
    try {
      const { _id, initial_waiting_time, charge_per_unit_time, time_multiplier } = req.body;
      if (!_id || !initial_waiting_time|| !time_multiplier) return res.status(400).send({ status: false, message: "Please add all fields" });
      const data = await waitingChargesModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { initial_waiting_time, charge_per_unit_time, time_multiplier, updated_by: req.user._id }, { new: true });
      if (data) {
        return res.status(200).send({ status: true, message: "Waiting charges updated successfully", data: data })
      }
      return res.status(200).send({ status: false, message: "No data found" })

    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  calculatePrice: async (req, res) => {
    try {
      const { pricingConfigId, distanceInKM, waitingTimeInMin, rideTimeStart, rideTimeEnd } = req.query;
      // console.log(req.query)
      if (!pricingConfigId || !distanceInKM || !rideTimeStart || !rideTimeEnd) return res.status(400).send({ status: false, message: "Please add all fields" });

      // const pricingConfig = await pricingConfigurationModel.findOne({ _id: new mongoose.Types.ObjectId(pricingConfigId) });
      let totalRideTimeInHours = Number(((new Date(rideTimeEnd).getTime() - new Date(rideTimeStart).getTime()) / 1000 / 60 / 60).toPrecision(3))

      // console.log("totalRideTimeInHours", totalRideTimeInHours)
      const pricingConfigData = await pricingConfigurationModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(pricingConfigId),
            enabled: true
          }
        },
        {
          $project: {
            name: 1,
            description: 1,
            enabled: 1,
          },
        },
        {
          $lookup: {
            from: "distancebaseprices",
            localField: "_id",
            foreignField: "config_id",
            pipeline: [
              {
                $project: {
                  day_of_week: 1,
                  max_distance: 1,
                  additional_price_per_km: 1,
                  price: 1,
                },
              },
              {
                $addFields: {
                  day: {
                    $subtract: [
                      { $dayOfWeek: new Date() },
                      1,
                    ],
                  },
                },
              },
            ],
            as: "baseAndAdditonal",
          },
        },
        {
          $lookup: {
            from: "timemultiplierfactors",
            localField: "_id",
            foreignField: "config_id",
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      start_time_in_hours: {
                        $lte: totalRideTimeInHours,
                      },
                    },
                    {
                      end_time_in_hours: {
                        $gt: totalRideTimeInHours,
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  multiplier: 1,
                },
              },
            ],
            as: "tmf",
          },
        },
        {
          $unwind: {
            path: "$tmf",
          },
        },
        {
          $lookup: {
            from: "waitingcharges",
            localField: "_id",
            foreignField: "config_id",
            pipeline: [
              {
                $match: {
                  initial_waiting_time: {
                    $lte: Number(waitingTimeInMin),
                  },
                },
              },
              {
                $project: {
                  initial_waiting_time: 1,
                  charge_per_unit_time: 1,
                  time_multiplier: 1,
                },
              },
            ],
            as: "wc",
          },
        },
      ]);
      if (pricingConfigData.length) {

        const todaysConfig = pricingConfigData[0].baseAndAdditonal.find((item) => { return item.day === new Date().getDay() })
        // console.log(todaysConfig)

        let additionalDistance = Number(distanceInKM) >= todaysConfig.max_distance ? Number(distanceInKM) - todaysConfig.max_distance : 0
        // console.log("additionalDistance", additionalDistance)
        let waitingCharges = ((waitingTimeInMin - pricingConfigData[0]?.wc[0]?.initial_waiting_time) / pricingConfigData[0]?.wc[0]?.time_multiplier) * pricingConfigData[0]?.wc[0]?.charge_per_unit_time || 0
        waitingCharges = Number(waitingCharges.toPrecision(3))
        // console.log("waitingCharges", waitingCharges)
        let finalPricing = (todaysConfig.price + (additionalDistance * todaysConfig.additional_price_per_km)) + (totalRideTimeInHours * pricingConfigData[0].tmf.multiplier) + waitingCharges
        console.log("finalPricing", todaysConfig.price, additionalDistance, todaysConfig.additional_price_per_km, totalRideTimeInHours, pricingConfigData[0].tmf.multiplier, waitingCharges)
        return res.status(200).send({ status: true, message: "Price calculated successfully", data: {
          totalRideTimeInHours,
          additionalDistance,
          waitingCharges,
          finalPricing: finalPricing,
          pricingConfig: pricingConfigData[0]
        } })
      }


      return res.status(400).send({ status: false, message: "Incorrect Pricing Configuration" })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  }
}